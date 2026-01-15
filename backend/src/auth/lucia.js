import { Lucia, TimeSpan } from "lucia";
import { PostgresJsAdapter } from "@lucia-auth/adapter-postgresql";
import { client } from "../db/index.js";

// Create Lucia adapter for PostgreSQL
const adapter = new PostgresJsAdapter(client, {
  user: "user",
  session: "session",
});

// Initialize Lucia
export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, "d"), // 30 days
  sessionCookie: {
    name: "auth_session",
    expires: false, // Session cookie (persists until browser closes) - set to true for persistent
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      firstName: attributes.first_name,
      lastName: attributes.last_name,
      role: attributes.role,
      isActive: attributes.is_active,
      isMasterSales: attributes.is_master_sales,
    };
  },
});

// Type definitions for Lucia
export const validateRequest = async (sessionId) => {
  if (!sessionId) {
    return { user: null, session: null };
  }

  try {
    const result = await lucia.validateSession(sessionId);
    return result;
  } catch (error) {
    return { user: null, session: null };
  }
};
