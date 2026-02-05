import { db } from "../db/index.js";
import { clientTable, contractsTable, activityLogTable } from "../db/schema.js";
import { eq, desc, and, like, or, count, sql } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

/**
 * ClientService - Business logic layer for contracted client operations
 * Follows: Route → Controller → Service → DB architecture
 */
class ClientService {
  /**
   * Create a new contracted client
   * @param {Object} clientData - Client data from request
   * @param {string} userId - User creating the client (becomes account manager)
   * @param {Object} metadata - Request metadata (ip, userAgent)
   * @returns {Promise<Object>} Created client
   */
  async createClient(clientData, userId, metadata = {}) {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      city,
      province,
      industry,
      wasteTypes,
      contractStartDate,
      contractEndDate,
      notes,
    } = clientData;

    const [client] = await db
      .insert(clientTable)
      .values({
        companyName,
        contactPerson,
        email,
        phone,
        address,
        city,
        province,
        industry,
        wasteTypes,
        contractStartDate: contractStartDate
          ? new Date(contractStartDate)
          : null,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
        notes,
        accountManager: userId, // Auto-assign to creator
      })
      .returning();

    // Log activity
    await this.logActivity({
      userId,
      action: "client_created",
      entityType: "client",
      entityId: client.id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return client;
  }

  /**
   * Get all clients
   * @returns {Promise<Array>} Array of clients
   */
  async getAllClients(options = {}) {
    const { status, search, page: rawPage = 1, limit: rawLimit = 10 } = options;
    const page = Number(rawPage) || 1;
    const limit = Number(rawLimit) || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      conditions.push(statuses.length === 1
        ? eq(clientTable.status, statuses[0])
        : clientTable.status.in(statuses));
    }

    if (search) {
      conditions.push(
        or(
          like(clientTable.companyName, `%${search}%`),
          like(clientTable.contactPerson, `%${search}%`),
          like(clientTable.email, `%${search}%`),
          like(clientTable.city, `%${search}%`),
          like(clientTable.province, `%${search}%`),
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Count total
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(clientTable)
      .where(whereClause);

    // Paginated data - get clients with DISTINCT to prevent duplicates from joins
    const clientRows = await db
      .selectDistinct()
      .from(clientTable)
      .where(whereClause)
      .orderBy(desc(clientTable.createdAt))
      .limit(limit)
      .offset(offset);

    // For each client, get their latest contract status efficiently using a batch query
    const clientIds = clientRows.map((c) => c.id);
    
    // Get latest contract for each client in one query using IN clause
    let latestContracts = [];
    if (clientIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      
      // Get all contracts for these clients
      const allContracts = await db
        .select({
          clientId: contractsTable.clientId,
          status: contractsTable.status,
          createdAt: contractsTable.createdAt,
        })
        .from(contractsTable)
        .where(inArray(contractsTable.clientId, clientIds))
        .orderBy(desc(contractsTable.createdAt));

      // Group by clientId and take only the first (latest) for each
      const contractMap = new Map();
      allContracts.forEach((contract) => {
        if (!contractMap.has(contract.clientId)) {
          contractMap.set(contract.clientId, contract.status);
        }
      });

      latestContracts = contractMap;
    }

    return {
      data: clientRows.map((client) => ({
        ...client,
        contractStatus: latestContracts.get(client.id) || null,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get client by ID
   * @param {string} clientId - Client UUID
   * @returns {Promise<Object>} Client object
   * @throws {AppError} If client not found
   */
  async getClientById(clientId) {
    const [client] = await db
      .select()
      .from(clientTable)
      .where(eq(clientTable.id, clientId))
      .limit(1);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    return client;
  }

  /**
   * Update client
   * @param {string} clientId - Client UUID
   * @param {Object} updateData - Fields to update
   * @param {string} userId - User performing the update
   * @param {Object} metadata - Request metadata (ip, userAgent)
   * @returns {Promise<Object>} Updated client
   * @throws {AppError} If client not found
   */
  async updateClient(clientId, updateData, userId, metadata = {}) {
    // Convert date strings to Date objects, or null if empty
    if ("contractStartDate" in updateData) {
      updateData.contractStartDate = updateData.contractStartDate ? new Date(updateData.contractStartDate) : null;
    }
    if ("contractEndDate" in updateData) {
      updateData.contractEndDate = updateData.contractEndDate ? new Date(updateData.contractEndDate) : null;
    }

    const [client] = await db
      .update(clientTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(clientTable.id, clientId))
      .returning();

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      action: "client_updated",
      entityType: "client",
      entityId: client.id,
      details: updateData,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return client;
  }

  /**
   * Delete client
   * @param {string} clientId - Client UUID
   * @param {string} userId - User performing the deletion
   * @param {Object} metadata - Request metadata (ip, userAgent)
   * @returns {Promise<Object>} Deleted client
   * @throws {AppError} If client not found
   */
  async deleteClient(clientId, userId, metadata = {}) {
    const [client] = await db
      .delete(clientTable)
      .where(eq(clientTable.id, clientId))
      .returning();

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      action: "client_deleted",
      entityType: "client",
      entityId: client.id,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return client;
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

export default ClientService;
