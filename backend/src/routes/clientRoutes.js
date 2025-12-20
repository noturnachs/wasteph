import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { clientValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.post("/", clientValidation, validate, createClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.patch("/:id", updateClient);
router.delete("/:id", requireRole("admin", "manager"), deleteClient);

export default router;
