import { db } from "../db/index.js";
import { clientTable, activityLogTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

export const createClient = async (req, res, next) => {
  try {
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
    } = req.body;

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
        accountManager: req.user.id,
      })
      .returning();

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "client_created",
      entityType: "client",
      entityId: client.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (req, res, next) => {
  try {
    const clients = await db
      .select()
      .from(clientTable)
      .orderBy(desc(clientTable.createdAt));

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [client] = await db
      .select()
      .from(clientTable)
      .where(eq(clientTable.id, id))
      .limit(1);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert date strings to Date objects if present
    if (updateData.contractStartDate) {
      updateData.contractStartDate = new Date(updateData.contractStartDate);
    }
    if (updateData.contractEndDate) {
      updateData.contractEndDate = new Date(updateData.contractEndDate);
    }

    const [client] = await db
      .update(clientTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(clientTable.id, id))
      .returning();

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "client_updated",
      entityType: "client",
      entityId: client.id,
      details: JSON.stringify(updateData),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [client] = await db
      .delete(clientTable)
      .where(eq(clientTable.id, id))
      .returning();

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "client_deleted",
      entityType: "client",
      entityId: client.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
