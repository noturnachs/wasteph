import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { inquiryValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// Public route - create inquiry from website
router.post("/", inquiryValidation, validate, createInquiry);

// Protected routes - admin only
router.get("/", requireAuth, getAllInquiries);
router.get("/:id", requireAuth, getInquiryById);
router.patch("/:id", requireAuth, updateInquiry);
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin", "manager"),
  deleteInquiry
);

export default router;
