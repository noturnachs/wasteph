import express from "express";
import {
  createPotential,
  getAllPotentials,
  getPotentialById,
  updatePotential,
  deletePotential,
} from "../controllers/potentialController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.post("/", createPotential);
router.get("/", getAllPotentials);
router.get("/:id", getPotentialById);
router.patch("/:id", updatePotential);
router.delete("/:id", requireRole("admin", "manager"), deletePotential);

export default router;
