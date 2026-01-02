import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  approveProposal,
  rejectProposal,
  cancelProposal,
  retryProposalEmail,
  downloadProposalPDF,
} from "../controllers/proposalController.js";
import {
  validateCreateProposal,
  validateUpdateProposal,
  validateApproveProposal,
  validateRejectProposal,
} from "../middleware/proposalValidation.js";

const router = Router();

/**
 * Proposal Routes
 * All routes require authentication
 */

// Create proposal (Sales)
router.post("/", requireAuth, validateCreateProposal, createProposal);

// Get all proposals (with filtering and pagination)
router.get("/", requireAuth, getAllProposals);

// Get proposal by ID
router.get("/:id", requireAuth, getProposalById);

// Update proposal (Sales - own proposals only)
router.put("/:id", requireAuth, validateUpdateProposal, updateProposal);

// Approve proposal (Admin only)
router.post("/:id/approve", requireAuth, validateApproveProposal, approveProposal);

// Reject proposal (Admin only)
router.post("/:id/reject", requireAuth, validateRejectProposal, rejectProposal);

// Cancel proposal (Sales - own proposals only)
router.post("/:id/cancel", requireAuth, cancelProposal);

// Retry email send (Admin only)
router.post("/:id/retry-email", requireAuth, retryProposalEmail);

// Download proposal PDF
router.get("/:id/pdf", requireAuth, downloadProposalPDF);

export default router;
