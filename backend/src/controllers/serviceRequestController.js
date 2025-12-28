import serviceRequestService from "../services/serviceRequestService.js";

// Get all service requests for a lead
export const getServiceRequestsByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const requests = await serviceRequestService.getServiceRequestsByLeadId(leadId);
    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single service request
export const getServiceRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await serviceRequestService.getServiceRequestById(id);
    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new service request
export const createServiceRequest = async (req, res, next) => {
  try {
    const newRequest = await serviceRequestService.createServiceRequest(req.body);
    res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Update a service request
export const updateServiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRequest = await serviceRequestService.updateServiceRequest(id, req.body);
    res.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a service request
export const deleteServiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceRequestService.deleteServiceRequest(id);
    res.json({
      success: true,
      message: "Service request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
