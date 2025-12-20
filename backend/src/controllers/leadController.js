import { db } from "../db/index.js";
import { leadTable, activityLogTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

export const createLead = async (req, res, next) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      city,
      province,
      wasteType,
      estimatedVolume,
      priority,
      estimatedValue,
      notes,
    } = req.body;

    const [lead] = await db
      .insert(leadTable)
      .values({
        companyName,
        contactPerson,
        email,
        phone,
        address,
        city,
        province,
        wasteType,
        estimatedVolume,
        priority,
        estimatedValue,
        notes,
        assignedTo: req.user.id,
      })
      .returning();

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "lead_created",
      entityType: "lead",
      entityId: lead.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await db
      .select()
      .from(leadTable)
      .orderBy(desc(leadTable.createdAt));

    res.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lead] = await db
      .select()
      .from(leadTable)
      .where(eq(leadTable.id, id))
      .limit(1);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [lead] = await db
      .update(leadTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(leadTable.id, id))
      .returning();

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "lead_updated",
      entityType: "lead",
      entityId: lead.id,
      details: JSON.stringify(updateData),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lead] = await db
      .delete(leadTable)
      .where(eq(leadTable.id, id))
      .returning();

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "lead_deleted",
      entityType: "lead",
      entityId: lead.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
