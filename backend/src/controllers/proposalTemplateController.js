import proposalTemplateService from "../services/proposalTemplateService.js";
import { AppError } from "../middleware/errorHandler.js";

/**
 * ProposalTemplateController - Handle HTTP requests for proposal template operations
 * Admin and Sales endpoints for template management
 */

// Allowed roles for template management
const TEMPLATE_MANAGEMENT_ROLES = ["admin", "master_sales", "sales"];

/**
 * Create a new proposal template
 * POST /api/proposal-templates
 */
export const createTemplate = async (req, res, next) => {
  try {
    // Check if user has permission to manage templates
    if (!TEMPLATE_MANAGEMENT_ROLES.includes(req.user.role)) {
      throw new AppError("You don't have permission to create proposal templates", 403);
    }

    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    };

    const template = await proposalTemplateService.createTemplate(
      req.body,
      req.user.id,
      metadata
    );

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all proposal templates
 * GET /api/proposal-templates
 */
export const getAllTemplates = async (req, res, next) => {
  try {
    const { isActive, templateType, search, page, limit } = req.query;

    const result = await proposalTemplateService.getAllTemplates({
      isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      templateType,
      search,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by ID
 * GET /api/proposal-templates/:id
 */
export const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await proposalTemplateService.getTemplateById(id);

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get default template
 * GET /api/proposal-templates/default
 */
export const getDefaultTemplate = async (req, res, next) => {
  try {
    const template = await proposalTemplateService.getDefaultTemplate();

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update proposal template
 * PUT /api/proposal-templates/:id
 */
export const updateTemplate = async (req, res, next) => {
  try {
    // Check if user has permission to manage templates
    if (!TEMPLATE_MANAGEMENT_ROLES.includes(req.user.role)) {
      throw new AppError("You don't have permission to update proposal templates", 403);
    }

    const { id } = req.params;
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    };

    const template = await proposalTemplateService.updateTemplate(
      id,
      req.body,
      req.user.id,
      metadata
    );

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Set template as default
 * POST /api/proposal-templates/:id/set-default
 */
export const setDefaultTemplate = async (req, res, next) => {
  try {
    // Check if user has permission to manage templates
    if (!TEMPLATE_MANAGEMENT_ROLES.includes(req.user.role)) {
      throw new AppError("You don't have permission to set default templates", 403);
    }

    const { id } = req.params;
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    };

    const template = await proposalTemplateService.setDefaultTemplate(
      id,
      req.user.id,
      metadata
    );

    res.status(200).json({
      success: true,
      data: template,
      message: "Template set as default",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete (soft delete) proposal template
 * DELETE /api/proposal-templates/:id
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    // Check if user has permission to manage templates
    if (!TEMPLATE_MANAGEMENT_ROLES.includes(req.user.role)) {
      throw new AppError("You don't have permission to delete proposal templates", 403);
    }

    const { id } = req.params;
    const metadata = {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    };

    const template = await proposalTemplateService.deleteTemplate(
      id,
      req.user.id,
      metadata
    );

    res.status(200).json({
      success: true,
      data: template,
      message: "Template deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Preview template rendering
 * POST /api/proposal-templates/preview
 */
export const previewTemplate = async (req, res, next) => {
  try {
    // Allow both admin and sales to preview (sales need it for proposal requests)

    const { templateHtml, sampleData } = req.body;

    if (!templateHtml || !sampleData) {
      throw new AppError(
        "Both templateHtml and sampleData are required",
        400
      );
    }

    // Render HTML with Handlebars
    const renderedHtml = proposalTemplateService.renderTemplate(
      templateHtml,
      sampleData
    );

    // Convert to PDF
    const pdfService = (await import("../services/pdfService.js")).default;
    const pdfBuffer = await pdfService.generatePDFFromHTML(renderedHtml);

    // Convert to base64
    const pdfBase64 = pdfBuffer.toString("base64");

    res.status(200).json({
      success: true,
      data: pdfBase64,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by type
 * GET /api/proposal-templates/type/:type
 */
export const getTemplateByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const template = await proposalTemplateService.getTemplateByType(type);

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get templates grouped by category
 * GET /api/proposal-templates/by-category
 */
export const getTemplatesByCategory = async (req, res, next) => {
  try {
    const templates = await proposalTemplateService.getTemplatesByCategory();

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Suggest template for inquiry
 * GET /api/proposal-templates/suggest/:inquiryId
 */
export const suggestTemplateForInquiry = async (req, res, next) => {
  try {
    const { inquiryId } = req.params;

    // Get inquiry (service will handle this)
    const inquiryService = (await import("../services/inquiryService.js")).default;
    const inquiry = await inquiryService.getInquiryById(inquiryId);

    // Suggest template
    const template = await proposalTemplateService.suggestTemplateForInquiry(inquiry);

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};
