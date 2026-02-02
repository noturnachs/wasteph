import { db } from "../db/index.js";
import {
  calendarEventTable,
  activityLogTable,
  inquiryTable,
  clientTable,
  userTable,
} from "../db/schema.js";
import { eq, and, gte, lte, desc, count, sql } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";

class CalendarEventService {
  /**
   * Log activity
   */
  async logActivity(data) {
    try {
      await db.insert(activityLogTable).values({
        ...data,
        details: data.details ? JSON.stringify(data.details) : null,
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }

  /**
   * Create a new calendar event
   */
  async createEvent(eventData, userId, metadata = {}) {
    const {
      title,
      description,
      eventType,
      scheduledDate,
      startTime,
      endTime,
      inquiryId,
      clientId,
      notes,
    } = eventData;

    const [event] = await db
      .insert(calendarEventTable)
      .values({
        userId,
        inquiryId: inquiryId || null,
        clientId: clientId || null,
        title,
        description: description || null,
        eventType: eventType || null,
        scheduledDate: new Date(scheduledDate),
        startTime: startTime || null,
        endTime: endTime || null,
        status: "scheduled",
        notes: notes || null,
      })
      .returning();

    // Log activity
    await this.logActivity({
      userId,
      inquiryId: event.inquiryId, // Link to inquiry for timeline (if applicable)
      action: "calendar_event_created",
      entityType: "calendar_event",
      entityId: event.id,
      details: {
        title: event.title,
        eventType: event.eventType,
        scheduledDate: event.scheduledDate,
        inquiryId: event.inquiryId,
        clientId: event.clientId,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return event;
  }

  /**
   * Get events for a user with optional filters
   * If viewAll is true (Master Sales), return all users' events
   */
  async getEvents(options = {}) {
    const {
      userId,
      viewAll = false,
      startDate,
      endDate,
      status,
      inquiryId,
      clientId,
      page = 1,
      limit = 50,
    } = options;

    const conditions = [];

    // User filter - only apply if not viewing all events
    if (!viewAll) {
      if (userId) {
        conditions.push(eq(calendarEventTable.userId, userId));
      } else {
        throw new AppError("User ID is required", 400);
      }
    }

    // Date range filter
    if (startDate) {
      conditions.push(
        gte(calendarEventTable.scheduledDate, new Date(startDate))
      );
    }
    if (endDate) {
      conditions.push(lte(calendarEventTable.scheduledDate, new Date(endDate)));
    }

    // Status filter
    if (status) {
      conditions.push(eq(calendarEventTable.status, status));
    }

    // Inquiry filter
    if (inquiryId) {
      conditions.push(eq(calendarEventTable.inquiryId, inquiryId));
    }

    // Client filter
    if (clientId) {
      conditions.push(eq(calendarEventTable.clientId, clientId));
    }

    // Build query with joins
    let query = db
      .select({
        id: calendarEventTable.id,
        userId: calendarEventTable.userId,
        inquiryId: calendarEventTable.inquiryId,
        clientId: calendarEventTable.clientId,
        title: calendarEventTable.title,
        description: calendarEventTable.description,
        eventType: calendarEventTable.eventType,
        scheduledDate: calendarEventTable.scheduledDate,
        startTime: calendarEventTable.startTime,
        endTime: calendarEventTable.endTime,
        status: calendarEventTable.status,
        completedAt: calendarEventTable.completedAt,
        notes: calendarEventTable.notes,
        createdAt: calendarEventTable.createdAt,
        updatedAt: calendarEventTable.updatedAt,
        // Include user info (flattened)
        userFirstName: userTable.firstName,
        userLastName: userTable.lastName,
        userEmail: userTable.email,
        // Include inquiry info (flattened)
        inquiryName: inquiryTable.name,
        inquiryCompany: inquiryTable.company,
        inquiryStatus: inquiryTable.status,
        // Include client info (flattened)
        clientCompanyName: clientTable.companyName,
        clientContactPerson: clientTable.contactPerson,
        clientStatus: clientTable.status,
      })
      .from(calendarEventTable)
      .leftJoin(userTable, eq(calendarEventTable.userId, userTable.id))
      .leftJoin(inquiryTable, eq(calendarEventTable.inquiryId, inquiryTable.id))
      .leftJoin(clientTable, eq(calendarEventTable.clientId, clientTable.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Count total
    let countQuery = db.select({ value: count() }).from(calendarEventTable);

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const [{ value: total }] = await countQuery;

    // Apply pagination and ordering
    const offset = (page - 1) * limit;
    const results = await query
      .orderBy(calendarEventTable.scheduledDate)
      .limit(limit)
      .offset(offset);

    // Transform flattened results with both nested and flat structures
    const events = results.map((event) => ({
      id: event.id,
      userId: event.userId,
      inquiryId: event.inquiryId,
      clientId: event.clientId,
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      scheduledDate: event.scheduledDate,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status,
      completedAt: event.completedAt,
      notes: event.notes,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      // Flattened fields for direct access
      inquiryName: event.inquiryName,
      inquiryCompany: event.inquiryCompany,
      inquiryStatus: event.inquiryStatus,
      clientCompanyName: event.clientCompanyName,
      clientContactPerson: event.clientContactPerson,
      clientStatus: event.clientStatus,
      // Nested structures for backward compatibility
      user: event.userFirstName
        ? {
            id: event.userId,
            name: `${event.userFirstName} ${event.userLastName}`,
            email: event.userEmail,
          }
        : null,
      inquiry: event.inquiryId
        ? {
            id: event.inquiryId,
            name: event.inquiryName,
            company: event.inquiryCompany,
            status: event.inquiryStatus,
          }
        : null,
      client: event.clientId
        ? {
            id: event.clientId,
            companyName: event.clientCompanyName,
            contactPerson: event.clientContactPerson,
            status: event.clientStatus,
          }
        : null,
    }));

    return {
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId) {
    const [result] = await db
      .select({
        id: calendarEventTable.id,
        userId: calendarEventTable.userId,
        inquiryId: calendarEventTable.inquiryId,
        clientId: calendarEventTable.clientId,
        title: calendarEventTable.title,
        description: calendarEventTable.description,
        eventType: calendarEventTable.eventType,
        scheduledDate: calendarEventTable.scheduledDate,
        startTime: calendarEventTable.startTime,
        endTime: calendarEventTable.endTime,
        status: calendarEventTable.status,
        completedAt: calendarEventTable.completedAt,
        notes: calendarEventTable.notes,
        createdAt: calendarEventTable.createdAt,
        updatedAt: calendarEventTable.updatedAt,
        // Flattened user info
        userFirstName: userTable.firstName,
        userLastName: userTable.lastName,
        userEmail: userTable.email,
        // Flattened inquiry info
        inquiryName: inquiryTable.name,
        inquiryCompany: inquiryTable.company,
        inquiryStatus: inquiryTable.status,
        // Flattened client info
        clientCompanyName: clientTable.companyName,
        clientContactPerson: clientTable.contactPerson,
        clientStatus: clientTable.status,
      })
      .from(calendarEventTable)
      .leftJoin(userTable, eq(calendarEventTable.userId, userTable.id))
      .leftJoin(inquiryTable, eq(calendarEventTable.inquiryId, inquiryTable.id))
      .leftJoin(clientTable, eq(calendarEventTable.clientId, clientTable.id))
      .where(eq(calendarEventTable.id, eventId))
      .limit(1);

    if (!result) {
      throw new AppError("Event not found", 404);
    }

    // Transform to flattened structure (keep both nested and flat for compatibility)
    const event = {
      id: result.id,
      userId: result.userId,
      inquiryId: result.inquiryId,
      clientId: result.clientId,
      title: result.title,
      description: result.description,
      eventType: result.eventType,
      scheduledDate: result.scheduledDate,
      startTime: result.startTime,
      endTime: result.endTime,
      status: result.status,
      completedAt: result.completedAt,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      // Flattened fields for direct access
      inquiryName: result.inquiryName,
      inquiryCompany: result.inquiryCompany,
      inquiryStatus: result.inquiryStatus,
      clientCompanyName: result.clientCompanyName,
      clientContactPerson: result.clientContactPerson,
      clientStatus: result.clientStatus,
      // Nested structures for backward compatibility
      user: result.userFirstName
        ? {
            id: result.userId,
            name: `${result.userFirstName} ${result.userLastName}`,
            email: result.userEmail,
          }
        : null,
      inquiry: result.inquiryId
        ? {
            id: result.inquiryId,
            name: result.inquiryName,
            company: result.inquiryCompany,
            status: result.inquiryStatus,
          }
        : null,
      client: result.clientId
        ? {
            id: result.clientId,
            companyName: result.clientCompanyName,
            contactPerson: result.clientContactPerson,
            status: result.clientStatus,
          }
        : null,
    };

    return event;
  }

  /**
   * Update event
   */
  async updateEvent(eventId, updateData, userId, metadata = {}) {
    const {
      title,
      description,
      eventType,
      scheduledDate,
      startTime,
      endTime,
      status,
      notes,
      inquiryId,
    } = updateData;

    // Get old event for logging
    const oldEvent = await this.getEventById(eventId);

    // Check ownership
    if (oldEvent.userId !== userId) {
      throw new AppError("You can only update your own events", 403);
    }

    const [event] = await db
      .update(calendarEventTable)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(eventType !== undefined && { eventType }),
        ...(scheduledDate !== undefined && {
          scheduledDate: new Date(scheduledDate),
        }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(inquiryId !== undefined && { inquiryId }),
        ...(status === "completed" &&
          !oldEvent.completedAt && { completedAt: new Date() }),
        updatedAt: new Date(),
      })
      .where(eq(calendarEventTable.id, eventId))
      .returning();

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      inquiryId: event.inquiryId, // Link to inquiry for timeline
      action: "calendar_event_updated",
      entityType: "calendar_event",
      entityId: event.id,
      details: {
        title: event.title,
        eventType: event.eventType,
        scheduledDate: event.scheduledDate,
        eventId: event.id, // Include eventId for navigation
        statusChanged:
          oldEvent.status !== event.status
            ? { from: oldEvent.status, to: event.status }
            : null,
        // Include notes/report if event was marked as completed
        notes: event.status === "completed" && event.notes ? event.notes : null,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return event;
  }

  /**
   * Delete event (soft delete - changes status to cancelled)
   */
  async deleteEvent(eventId, userId, metadata = {}) {
    // Get event for ownership check
    const event = await this.getEventById(eventId);

    // Check ownership
    if (event.userId !== userId) {
      throw new AppError("You can only delete your own events", 403);
    }

    // Soft delete by setting status to cancelled
    const [cancelledEvent] = await db
      .update(calendarEventTable)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(calendarEventTable.id, eventId))
      .returning();

    if (!cancelledEvent) {
      throw new AppError("Event not found", 404);
    }

    // Log activity
    await this.logActivity({
      userId,
      inquiryId: event.inquiryId, // Link to inquiry for timeline
      action: "calendar_event_deleted",
      entityType: "calendar_event",
      entityId: eventId,
      details: {
        title: event.title,
        eventType: event.eventType,
        scheduledDate: event.scheduledDate,
      },
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return cancelledEvent;
  }

  /**
   * Mark event as completed with optional notes/report
   */
  async completeEvent(eventId, userId, notes = null, metadata = {}) {
    const updateData = {
      status: "completed",
      completedAt: new Date(),
    };

    // Update notes if provided
    if (notes !== null && notes !== undefined) {
      updateData.notes = notes;
    }

    return this.updateEvent(eventId, updateData, userId, metadata);
  }
}

export default new CalendarEventService();
