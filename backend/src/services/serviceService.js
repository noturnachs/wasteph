import { db } from "../db/index.js";
import { serviceTable, proposalTemplateTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

/**
 * ServiceService - Business logic for service operations
 */
class ServiceService {
  /**
   * Get all services
   * @returns {Promise<Array>} List of services
   */
  async getAllServices() {
    const services = await db
      .select()
      .from(serviceTable)
      .where(eq(serviceTable.isActive, true));

    return services;
  }

  /**
   * Get service by ID with its default template
   * @param {string} serviceId - Service UUID
   * @returns {Promise<Object>} Service with template data
   */
  async getServiceById(serviceId) {
    const [service] = await db
      .select({
        id: serviceTable.id,
        name: serviceTable.name,
        description: serviceTable.description,
        defaultTemplateId: serviceTable.defaultTemplateId,
        isActive: serviceTable.isActive,
        createdAt: serviceTable.createdAt,
        template: {
          id: proposalTemplateTable.id,
          name: proposalTemplateTable.name,
          description: proposalTemplateTable.description,
          htmlTemplate: proposalTemplateTable.htmlTemplate,
          templateType: proposalTemplateTable.templateType,
          category: proposalTemplateTable.category,
          isActive: proposalTemplateTable.isActive,
        },
      })
      .from(serviceTable)
      .leftJoin(
        proposalTemplateTable,
        eq(serviceTable.defaultTemplateId, proposalTemplateTable.id)
      )
      .where(eq(serviceTable.id, serviceId))
      .limit(1);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    return service;
  }

  /**
   * Get template for a service (helper method)
   * @param {string} serviceId - Service UUID
   * @returns {Promise<Object|null>} Template object or null
   */
  async getTemplateForService(serviceId) {
    const service = await this.getServiceById(serviceId);
    return service.template || null;
  }
}

export default new ServiceService();
