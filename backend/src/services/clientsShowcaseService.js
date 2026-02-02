import { db } from "../db/index.js";
import { clientsShowcaseTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { deleteObject, getPresignedUrl } from "./s3Service.js";

/**
 * Clients Showcase Service
 * Handles business logic for client showcase items
 */

class ClientsShowcaseService {
  /**
   * Add presigned URLs to client showcase logo
   */
  async addPresignedUrls(client) {
    if (client.logo) {
      try {
        client.logoUrl = await getPresignedUrl(client.logo, 3600); // 1 hour expiry
      } catch (error) {
        console.warn(`Failed to generate presigned URL for logo: ${client.logo}`, error);
        client.logoUrl = null;
      }
    }
    return client;
  }

  /**
   * Get all active client showcases (public)
   */
  async getActiveClientsShowcase() {
    const clients = await db
      .select()
      .from(clientsShowcaseTable)
      .where(eq(clientsShowcaseTable.isActive, true))
      .orderBy(desc(clientsShowcaseTable.createdAt));

    // Add presigned URLs for logos
    return await Promise.all(clients.map(c => this.addPresignedUrls(c)));
  }

  /**
   * Get all client showcases (admin - includes inactive)
   */
  async getAllClientsShowcase() {
    const clients = await db
      .select()
      .from(clientsShowcaseTable)
      .orderBy(desc(clientsShowcaseTable.createdAt));

    // Add presigned URLs for logos
    return await Promise.all(clients.map(c => this.addPresignedUrls(c)));
  }

  /**
   * Get client showcase by ID
   */
  async getClientsShowcaseById(id) {
    const [client] = await db
      .select()
      .from(clientsShowcaseTable)
      .where(eq(clientsShowcaseTable.id, id))
      .limit(1);

    if (!client) return null;

    // Add presigned URL for logo
    return await this.addPresignedUrls(client);
  }

  /**
   * Create new client showcase
   */
  async createClientsShowcase(clientData, userId) {
    // Whitelist allowed fields to prevent mass assignment
    const allowedData = {
      company: clientData.company,
      industry: clientData.industry,
      logo: clientData.logo || null,
      location: clientData.location || null,
      employees: clientData.employees || null,
      established: clientData.established || null,
      background: clientData.background,
      challenge: clientData.challenge || null,
      solution: clientData.solution || null,
      testimonial: clientData.testimonial,
      author: clientData.author,
      position: clientData.position || null,
      rating: clientData.rating || null,
      wasteReduction: clientData.wasteReduction || null,
      partnership: clientData.partnership || null,
      achievements: clientData.achievements || [],
      isActive: clientData.isActive !== undefined ? clientData.isActive : true,
      createdBy: userId, // Server-controlled field
    };

    const [client] = await db
      .insert(clientsShowcaseTable)
      .values(allowedData)
      .returning();

    return client;
  }

  /**
   * Update client showcase
   */
  async updateClientsShowcase(id, clientData) {
    // Whitelist allowed fields to prevent mass assignment
    const allowedData = {};

    // Only include fields that are present in clientData
    if (clientData.company !== undefined) allowedData.company = clientData.company;
    if (clientData.industry !== undefined) allowedData.industry = clientData.industry;
    if (clientData.logo !== undefined) allowedData.logo = clientData.logo;
    if (clientData.location !== undefined) allowedData.location = clientData.location;
    if (clientData.employees !== undefined) allowedData.employees = clientData.employees;
    if (clientData.established !== undefined) allowedData.established = clientData.established;
    if (clientData.background !== undefined) allowedData.background = clientData.background;
    if (clientData.challenge !== undefined) allowedData.challenge = clientData.challenge;
    if (clientData.solution !== undefined) allowedData.solution = clientData.solution;
    if (clientData.testimonial !== undefined) allowedData.testimonial = clientData.testimonial;
    if (clientData.author !== undefined) allowedData.author = clientData.author;
    if (clientData.position !== undefined) allowedData.position = clientData.position;
    if (clientData.rating !== undefined) allowedData.rating = clientData.rating;
    if (clientData.wasteReduction !== undefined) allowedData.wasteReduction = clientData.wasteReduction;
    if (clientData.partnership !== undefined) allowedData.partnership = clientData.partnership;
    if (clientData.achievements !== undefined) allowedData.achievements = clientData.achievements;
    if (clientData.isActive !== undefined) allowedData.isActive = clientData.isActive;

    // Server-controlled field
    allowedData.updatedAt = new Date();

    const [updated] = await db
      .update(clientsShowcaseTable)
      .set(allowedData)
      .where(eq(clientsShowcaseTable.id, id))
      .returning();

    return updated;
  }

  /**
   * Delete client showcase
   */
  async deleteClientsShowcase(id) {
    const [deleted] = await db
      .delete(clientsShowcaseTable)
      .where(eq(clientsShowcaseTable.id, id))
      .returning();

    return deleted;
  }

  /**
   * Toggle client showcase active status
   */
  async toggleClientsShowcaseStatus(id) {
    const client = await this.getClientsShowcaseById(id);

    if (!client) {
      throw new Error("Client showcase not found");
    }

    const [updated] = await db
      .update(clientsShowcaseTable)
      .set({
        isActive: !client.isActive,
        updatedAt: new Date(),
      })
      .where(eq(clientsShowcaseTable.id, id))
      .returning();

    return updated;
  }

  /**
   * Update logo for client showcase
   */
  async updateLogo(clientShowcaseId, logoUrl, logoName) {
    // Get existing client showcase to check for old logo
    const [existingClient] = await db
      .select()
      .from(clientsShowcaseTable)
      .where(eq(clientsShowcaseTable.id, clientShowcaseId))
      .limit(1);

    if (!existingClient) {
      return null;
    }

    // Delete old logo from S3 if exists
    if (existingClient.logo) {
      try {
        await deleteObject(existingClient.logo);
      } catch (error) {
        console.warn("Failed to delete old client showcase logo from S3:", error);
      }
    }

    // Update with new S3 key
    const [updated] = await db
      .update(clientsShowcaseTable)
      .set({
        logo: logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(clientsShowcaseTable.id, clientShowcaseId))
      .returning();

    return updated;
  }
}

export default new ClientsShowcaseService();
