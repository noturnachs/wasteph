import { db } from "../db/index.js";
import { inquiryTable, activityLogTable } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, message } = req.body;

    const [inquiry] = await db
      .insert(inquiryTable)
      .values({
        name,
        email,
        phone,
        company,
        message,
        source: "website",
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await db
      .select()
      .from(inquiryTable)
      .orderBy(desc(inquiryTable.createdAt));

    res.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [inquiry] = await db
      .select()
      .from(inquiryTable)
      .where(eq(inquiryTable.id, id))
      .limit(1);

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404);
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, notes } = req.body;

    const [inquiry] = await db
      .update(inquiryTable)
      .set({
        ...(status && { status }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      })
      .where(eq(inquiryTable.id, id))
      .returning();

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "inquiry_updated",
      entityType: "inquiry",
      entityId: inquiry.id,
      details: JSON.stringify({ status, assignedTo, notes }),
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [inquiry] = await db
      .delete(inquiryTable)
      .where(eq(inquiryTable.id, id))
      .returning();

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404);
    }

    // Log activity
    await db.insert(activityLogTable).values({
      userId: req.user.id,
      action: "inquiry_deleted",
      entityType: "inquiry",
      entityId: inquiry.id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
