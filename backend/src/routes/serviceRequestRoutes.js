import express from "express";
import * as serviceRequestController from "../controllers/serviceRequestController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all service requests for a lead
router.get("/lead/:leadId", serviceRequestController.getServiceRequestsByLeadId);

// Get a single service request
router.get("/:id", serviceRequestController.getServiceRequestById);

// Create a new service request
router.post("/", serviceRequestController.createServiceRequest);

// Update a service request
router.put("/:id", serviceRequestController.updateServiceRequest);

// Delete a service request
router.delete("/:id", serviceRequestController.deleteServiceRequest);

export default router;
