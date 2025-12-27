import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

class UserService {
  async getAllUsers(filters = {}) {
    const conditions = [eq(userTable.isActive, true)];

    if (filters.role) {
      conditions.push(eq(userTable.role, filters.role));
    }

    const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        role: userTable.role,
        isActive: userTable.isActive,
      })
      .from(userTable)
      .where(and(...conditions))
      .orderBy(userTable.firstName);

    return users;
  }

  async getUserById(userId) {
    const [user] = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        role: userTable.role,
        isActive: userTable.isActive,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    return user;
  }
}

export default new UserService();
