import { db } from "../db/index.js";
import { showcaseTable } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { deleteObject, getPresignedUrl } from "./s3Service.js";

/**
 * Showcase Service
 * Handles business logic for showcase items
 */

class ShowcaseService {
  /**
   * Add presigned URLs to showcase image
   */
  async addPresignedUrls(showcase) {
    if (showcase.image) {
      try {
        showcase.imageUrl = await getPresignedUrl(showcase.image, 3600); // 1 hour expiry
      } catch (error) {
        console.warn(`Failed to generate presigned URL for image: ${showcase.image}`, error);
        showcase.imageUrl = null;
      }
    }
    return showcase;
  }

  /**
   * Get all active showcases (public)
   */
  async getActiveShowcases(limit = 6) {
    const showcases = await db
      .select()
      .from(showcaseTable)
      .where(eq(showcaseTable.isActive, true))
      .orderBy(desc(showcaseTable.displayOrder), desc(showcaseTable.createdAt))
      .limit(limit);

    // Add presigned URLs for images
    return await Promise.all(showcases.map(s => this.addPresignedUrls(s)));
  }

  /**
   * Get all showcases (admin - includes inactive)
   */
  async getAllShowcases() {
    const showcases = await db
      .select()
      .from(showcaseTable)
      .orderBy(desc(showcaseTable.displayOrder), desc(showcaseTable.createdAt));

    // Add presigned URLs for images
    return await Promise.all(showcases.map(s => this.addPresignedUrls(s)));
  }

  /**
   * Get showcase by ID
   */
  async getShowcaseById(id) {
    const [showcase] = await db
      .select()
      .from(showcaseTable)
      .where(eq(showcaseTable.id, id))
      .limit(1);

    if (!showcase) return null;

    // Add presigned URL for image
    return await this.addPresignedUrls(showcase);
  }

  /**
   * Create new showcase
   */
  async createShowcase(showcaseData, userId) {
    // Whitelist allowed fields to prevent mass assignment
    const allowedData = {
      title: showcaseData.title,
      tagline: showcaseData.tagline || null,
      description: showcaseData.description,
      image: showcaseData.image || null,
      link: showcaseData.link || null,
      displayOrder: showcaseData.displayOrder !== undefined ? showcaseData.displayOrder : 0,
      isActive: showcaseData.isActive !== undefined ? showcaseData.isActive : true,
      createdBy: userId, // Server-controlled field
    };

    const [showcase] = await db
      .insert(showcaseTable)
      .values(allowedData)
      .returning();

    return showcase;
  }

  /**
   * Update showcase
   */
  async updateShowcase(id, showcaseData) {
    // Whitelist allowed fields to prevent mass assignment
    const allowedData = {};

    // Only include fields that are present in showcaseData
    if (showcaseData.title !== undefined) allowedData.title = showcaseData.title;
    if (showcaseData.tagline !== undefined) allowedData.tagline = showcaseData.tagline;
    if (showcaseData.description !== undefined) allowedData.description = showcaseData.description;
    if (showcaseData.image !== undefined) allowedData.image = showcaseData.image;
    if (showcaseData.link !== undefined) allowedData.link = showcaseData.link;
    if (showcaseData.displayOrder !== undefined) allowedData.displayOrder = showcaseData.displayOrder;
    if (showcaseData.isActive !== undefined) allowedData.isActive = showcaseData.isActive;

    // Server-controlled field
    allowedData.updatedAt = new Date();

    const [updated] = await db
      .update(showcaseTable)
      .set(allowedData)
      .where(eq(showcaseTable.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete showcase
   */
  async deleteShowcase(id) {
    const [deleted] = await db
      .delete(showcaseTable)
      .where(eq(showcaseTable.id, id))
      .returning();

    return deleted;
  }

  /**
   * Toggle showcase active status
   */
  async toggleShowcaseStatus(id) {
    const showcase = await this.getShowcaseById(id);
    
    if (!showcase) {
      throw new Error("Showcase not found");
    }

    const [updated] = await db
      .update(showcaseTable)
      .set({
        isActive: !showcase.isActive,
        updatedAt: new Date(),
      })
      .where(eq(showcaseTable.id, id))
      .returning();

    return updated;
  }

  /**
   * Update display order
   */
  async updateDisplayOrder(id, displayOrder) {
    const [updated] = await db
      .update(showcaseTable)
      .set({
        displayOrder,
        updatedAt: new Date(),
      })
      .where(eq(showcaseTable.id, id))
      .returning();

    return updated;
  }

  /**
   * Update image for showcase
   */
  async updateImage(showcaseId, imageUrl, imageName) {
    // Get existing showcase to check for old image
    const [existingShowcase] = await db
      .select()
      .from(showcaseTable)
      .where(eq(showcaseTable.id, showcaseId))
      .limit(1);

    if (!existingShowcase) {
      return null;
    }

    // Delete old image from S3 if exists
    if (existingShowcase.image) {
      try {
        await deleteObject(existingShowcase.image);
      } catch (error) {
        console.warn("Failed to delete old showcase image from S3:", error);
      }
    }

    // Update with new S3 key
    const [updated] = await db
      .update(showcaseTable)
      .set({
        image: imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(showcaseTable.id, showcaseId))
      .returning();

    return updated;
  }
}

export default new ShowcaseService();
