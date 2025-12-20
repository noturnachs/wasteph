import { db } from "../db/index.js";
import { potentialTable, activityLogTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

export const createPotential = async (req, res, next) => {
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
      wasteType,
      estimatedVolume,
      source,
      priority,
      notes,
    } = req.body;

    const [potential] = await db
      .insert(potentialTable)
      .values({
        companyName,
        contactPerson,
        email,
        phone,
        address,
        city,
        province,
        industry,
        wasteType,
        estimatedVolume,
        source,
        priority,
        notes,
        assignedTo: req.user.id,
      })
      .returning();

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "potential_created",
      entityType: "potential",
      entityId: potential.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Potential client created successfully",
      data: potential,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPotentials = async (req, res, next) => {
  try {
    const potentials = await db
      .select()
      .from(potentialTable)
      .orderBy(desc(potentialTable.createdAt));

    res.json({
      success: true,
      data: potentials,
    });
  } catch (error) {
    next(error);
  }
};

export const getPotentialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [potential] = await db
      .select()
      .from(potentialTable)
      .where(eq(potentialTable.id, id))
      .limit(1);

    if (!potential) {
      throw new AppError("Potential client not found", 404);
    }

    res.json({
      success: true,
      data: potential,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePotential = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [potential] = await db
      .update(potentialTable)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(potentialTable.id, id))
      .returning();

    if (!potential) {
      throw new AppError("Potential client not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "potential_updated",
      entityType: "potential",
      entityId: potential.id,
      details: JSON.stringify(updateData),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Potential client updated successfully",
      data: potential,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePotential = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [potential] = await db
      .delete(potentialTable)
      .where(eq(potentialTable.id, id))
      .returning();

    if (!potential) {
      throw new AppError("Potential client not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "potential_deleted",
      entityType: "potential",
      entityId: potential.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Potential client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
