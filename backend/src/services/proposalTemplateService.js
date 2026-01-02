import { db } from "../db/index.js";
import { proposalTemplateTable, activityLogTable } from "../db/schema.js";
import { eq, desc, and, or, like, count } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";
import Handlebars from "handlebars";

/**
 * ProposalTemplateService - Business logic for proposal template operations
 */
class ProposalTemplateService {
  /**
   * Create a new proposal template
   * @param {Object} templateData - Template data
   * @param {string} userId - User creating the template (admin)
   * @param {Object} metadata - Request metadata
   * @returns {Promise<Object>} Created template
   */
  async createTemplate(templateData, userId, metadata = {}) {
    const { name, description, htmlTemplate, isDefault } = templateData;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await db
        .update(proposalTemplateTable)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(proposalTemplateTable.isDefault, true));
    }

    const [template] = await db
      .insert(proposalTemplateTable)
      .values({
        name,
        description,
        htmlTemplate,
        isDefault: isDefault || false,
        isActive: true,
      })
      .returning();

    // Log activity
    await this.logActivity({
      userId,
      action: "proposal_template_created",
      entityType: "proposal_template",
      entityId: template.id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return template;
  }

  /**
   * Get all proposal templates
   * @param {Object} options - Query options { isActive, search, page, limit }
   * @returns {Promise<Object>} Templates with pagination
   */
  async getAllTemplates(options = {}) {
    const { isActive, search, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    let query = db.select().from(proposalTemplateTable);
    const conditions = [];

    // Active filter
    if (isActive !== undefined) {
      conditions.push(eq(proposalTemplateTable.isActive, isActive));
    }

    // Search filter (name or description)
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(proposalTemplateTable.name, searchTerm),
          like(proposalTemplateTable.description, searchTerm)
        )
      );
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Get total count
    let countQuery = db
      .select({ value: count() })
      .from(proposalTemplateTable);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ value: total }] = await countQuery;

    // Get templates with pagination
    const templates = await query
      .orderBy(desc(proposalTemplateTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: templates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template UUID
   * @returns {Promise<Object>} Template object
   */
  async getTemplateById(templateId) {
    const [template] = await db
      .select()
      .from(proposalTemplateTable)
      .where(eq(proposalTemplateTable.id, templateId))
      .limit(1);

    if (!template) {
      throw new AppError("Proposal template not found", 404);
    }

    return template;
  }

  /**
   * Get default template
   * @returns {Promise<Object>} Default template
   */
  async getDefaultTemplate() {
    const [template] = await db
      .select()
      .from(proposalTemplateTable)
      .where(
        and(
          eq(proposalTemplateTable.isDefault, true),
          eq(proposalTemplateTable.isActive, true)
        )
      )
      .limit(1);

    if (!template) {
      throw new AppError("No default template found", 404);
    }

    return template;
  }

  /**
   * Update proposal template
   * @param {string} templateId - Template UUID
   * @param {Object} updateData - Fields to update
   * @param {string} userId - User performing the update
   * @param {Object} metadata - Request metadata
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(templateId, updateData, userId, metadata = {}) {
    const { name, description, htmlTemplate, isDefault, isActive } = updateData;

    // If setting as default, unset other defaults first
    if (isDefault === true) {
      await db
        .update(proposalTemplateTable)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(proposalTemplateTable.isDefault, true));
    }

    const [template] = await db
      .update(proposalTemplateTable)
      .set({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(htmlTemplate && { htmlTemplate }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(proposalTemplateTable.id, templateId))
      .returning();

    if (!template) {
      throw new AppError("Proposal template not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      action: "proposal_template_updated",
      entityType: "proposal_template",
      entityId: template.id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return template;
  }

  /**
   * Set template as default
   * @param {string} templateId - Template UUID
   * @param {string} userId - User performing the action
   * @param {Object} metadata - Request metadata
   * @returns {Promise<Object>} Updated template
   */
  async setDefaultTemplate(templateId, userId, metadata = {}) {
    // Unset all defaults first
    await db
      .update(proposalTemplateTable)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(proposalTemplateTable.isDefault, true));

    // Set new default
    const [template] = await db
      .update(proposalTemplateTable)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(proposalTemplateTable.id, templateId))
      .returning();

    if (!template) {
      throw new AppError("Proposal template not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      action: "proposal_template_set_default",
      entityType: "proposal_template",
      entityId: template.id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return template;
  }

  /**
   * Delete (soft delete) proposal template
   * @param {string} templateId - Template UUID
   * @param {string} userId - User performing the deletion
   * @param {Object} metadata - Request metadata
   * @returns {Promise<Object>} Deleted template
   */
  async deleteTemplate(templateId, userId, metadata = {}) {
    // Check if template is default
    const template = await this.getTemplateById(templateId);
    if (template.isDefault) {
      throw new AppError("Cannot delete default template", 400);
    }

    // Soft delete by setting isActive to false
    const [deletedTemplate] = await db
      .update(proposalTemplateTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(proposalTemplateTable.id, templateId))
      .returning();

    // Log activity
    await this.logActivity({
      userId,
      action: "proposal_template_deleted",
      entityType: "proposal_template",
      entityId: templateId,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return deletedTemplate;
  }

  /**
   * Render template with data using Handlebars
   * @param {string} templateHtml - Template HTML string with {{placeholders}}
   * @param {Object} data - Data to inject into template
   * @returns {string} Rendered HTML
   */
  renderTemplate(templateHtml, data) {
    try {
      // Register Handlebars helpers
      this.registerHandlebarsHelpers();

      const template = Handlebars.compile(templateHtml);
      return template(data);
    } catch (error) {
      throw new AppError(
        `Template rendering failed: ${error.message}`,
        500
      );
    }
  }

  /**
   * Register custom Handlebars helpers
   */
  registerHandlebarsHelpers() {
    // Helper for formatting currency
    Handlebars.registerHelper("currency", function (value) {
      return `₱${Number(value).toFixed(2)}`;
    });

    // Helper for formatting dates
    Handlebars.registerHelper("formatDate", function (date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-PH");
    });

    // Helper for conditional display
    Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });
  }

  /**
   * Log activity to activity log table
   * @param {Object} activityData - Activity log data
   * @returns {Promise<void>}
   */
  async logActivity(activityData) {
    const { userId, action, entityType, entityId, details, ipAddress, userAgent } =
      activityData;

    await db.insert(activityLogTable).values({
      userId,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent,
    });
  }
}

export default new ProposalTemplateService();
