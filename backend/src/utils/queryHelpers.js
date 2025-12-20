import { sql } from "drizzle-orm";

export const buildPaginationQuery = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const buildSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return null;

  const conditions = fields.map(
    (field) => sql`${field} ILIKE ${`%${searchTerm}%`}`
  );

  return sql`(${sql.join(conditions, sql` OR `)})`;
};

export const buildDateRangeQuery = (field, startDate, endDate) => {
  const conditions = [];

  if (startDate) {
    conditions.push(sql`${field} >= ${new Date(startDate)}`);
  }

  if (endDate) {
    conditions.push(sql`${field} <= ${new Date(endDate)}`);
  }

  return conditions.length > 0 ? sql.join(conditions, sql` AND `) : null;
};

export const formatResponse = (
  success,
  data = null,
  message = null,
  meta = null
) => {
  const response = { success };

  if (message) response.message = message;
  if (data !== null) response.data = data;
  if (meta) response.meta = meta;

  return response;
};

export const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
