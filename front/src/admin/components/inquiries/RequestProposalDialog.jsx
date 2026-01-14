import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Eye, Send, Loader2, Sparkles } from "lucide-react";
import { api } from "../../services/api";
import { toast } from "sonner";

// Service Type Options
const SERVICE_TYPE_OPTIONS = [
  { value: "waste_collection", label: "Waste Collection (Compactor Hauling)", icon: "🚛" },
  { value: "hazardous", label: "Hazardous Waste Collection", icon: "☢️" },
  { value: "fixed_monthly", label: "Fixed Monthly Rate", icon: "📅" },
  { value: "clearing", label: "Clearing Project", icon: "🏗️" },
  { value: "one_time", label: "One Time Hauling", icon: "🚚" },
  { value: "long_term", label: "Long Term Garbage (Per-kg)", icon: "⚖️" },
  { value: "recyclables", label: "Purchase of Recyclables", icon: "♻️" },
];

// Service Type to Template Type Mapping
const SERVICE_TO_TEMPLATE_MAP = {
  waste_collection: "compactor_hauling",
  hazardous: "hazardous_waste",
  fixed_monthly: "fixed_monthly",
  clearing: "clearing_project",
  one_time: "one_time_hauling",
  long_term: "long_term",
  recyclables: "recyclables_purchase",
};

export function RequestProposalDialog({ open, onOpenChange, inquiry, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [template, setTemplate] = useState(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState("");

  // Client info form state - matches our simplified placeholders
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientCompany: "",
    clientPosition: "",
    clientAddress: "",
    proposalDate: new Date().toISOString().split("T")[0],
    validityDays: 30,
    notes: "",
  });

  // Pre-populate from inquiry and load template if service type is available
  useEffect(() => {
    const initialize = async () => {
      if (!open) return;

      // Pre-populate form from inquiry
      if (inquiry) {
        setFormData({
          clientName: inquiry.name || "",
          clientEmail: inquiry.email || "",
          clientPhone: inquiry.phone || "",
          clientCompany: inquiry.company || "",
          clientPosition: inquiry.position || "",
          clientAddress: inquiry.address || "",
          proposalDate: new Date().toISOString().split("T")[0],
          validityDays: 30,
          notes: "",
        });

        // Pre-select service type if available from inquiry
        if (inquiry.serviceType) {
          setSelectedServiceType(inquiry.serviceType);
          // Load template for this service type
          await loadTemplateForServiceType(inquiry.serviceType);
        }
      }
    };

    initialize();
  }, [open, inquiry]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setPreviewHtml("");
    }
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load template based on selected service type
  const loadTemplateForServiceType = async (serviceType) => {
    if (!serviceType) return;

    setIsLoadingTemplate(true);
    try {
      const templateType = SERVICE_TO_TEMPLATE_MAP[serviceType];
      if (!templateType) {
        toast.error("Invalid service type selected");
        return;
      }

      // Fetch template by type
      const response = await api.getTemplateByType(templateType);
      const fetchedTemplate = response.data || response;
      setTemplate(fetchedTemplate);
    } catch (error) {
      console.error("Failed to load template for service type:", error);
      toast.error("Could not load template for this service type");
      
      // Fallback to default template
      try {
        const response = await api.getDefaultProposalTemplate();
        const defaultTemplate = response.data || response;
        setTemplate(defaultTemplate);
      } catch (fallbackError) {
        console.error("Failed to load default template:", fallbackError);
      }
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  // Handle service type selection
  const handleServiceTypeChange = async (serviceType) => {
    setSelectedServiceType(serviceType);
    await loadTemplateForServiceType(serviceType);
  };

  const generatePreview = async () => {
    if (!template?.htmlTemplate) {
      toast.error("Template not loaded");
      return;
    }

    setIsLoadingPreview(true);
    try {
      // Calculate validity date
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + (parseInt(formData.validityDays) || 30));

      // Prepare data for template
      const templateData = {
        clientName: formData.clientName || "Client Name",
        clientEmail: formData.clientEmail || "",
        clientPhone: formData.clientPhone || "",
        clientCompany: formData.clientCompany || "",
        clientPosition: formData.clientPosition || "",
        clientAddress: formData.clientAddress || "",
        proposalDate: new Date(formData.proposalDate).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        validUntilDate: validUntilDate.toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      let rendered = template.htmlTemplate;

      // Handle {{#if fieldName}} ... {{/if}} conditionals
      // Remove the block if field is empty, keep content if field has value
      Object.keys(templateData).forEach((key) => {
        const ifRegex = new RegExp(`\\{\\{#if ${key}\\}\\}([\\s\\S]*?)\\{\\{/if\\}\\}`, "g");
        if (templateData[key]) {
          // Keep the content, remove the if/endif tags
          rendered = rendered.replace(ifRegex, "$1");
        } else {
          // Remove the entire block
          rendered = rendered.replace(ifRegex, "");
        }
      });

      // Replace simple {{fieldName}} placeholders
      Object.keys(templateData).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        rendered = rendered.replace(regex, templateData[key] || "");
      });

      // Handle {{#each services}} blocks - remove for now since we don't have services yet
      rendered = rendered.replace(/\{\{#each\s+[\w.]+\}\}[\s\S]*?\{\{\/each\}\}/g, "");

      // Strip any remaining Handlebars syntax
      rendered = rendered.replace(/\{\{[^{}]*\}\}/g, "");
      setPreviewHtml(rendered);
      setCurrentStep(3);
    } catch (error) {
      console.error("❌ Preview error:", error);
      toast.error("Failed to generate preview");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + (parseInt(formData.validityDays) || 30));

      // Prepare proposal data in the format backend expects
      const proposalData = {
        // Required: Services array (using placeholder service for now)
        services: [
          {
            name: "Waste Collection Service",
            description: "Standard waste collection service",
            quantity: 1,
            unitPrice: 0,
            subtotal: 0,
          },
        ],

        // Required: Pricing object
        pricing: {
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0,
          taxRate: 12,
        },

        // Required: Terms object
        terms: {
          paymentTerms: "Net 30",
          validityDays: parseInt(formData.validityDays) || 30,
          notes: formData.notes || "",
        },

        // Additional client information (stored but not validated)
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientCompany: formData.clientCompany,
        clientPosition: formData.clientPosition,
        clientAddress: formData.clientAddress,
        proposalDate: formData.proposalDate,
      };

      // Check if revising a rejected proposal
      const isRevision = inquiry?.proposalId && inquiry?.proposalStatus === "rejected";

      if (isRevision) {
        await api.updateProposal(inquiry.proposalId, {
          proposalData,
          templateId: template?.id,
        });
        toast.success("Proposal request revised and resubmitted");
      } else {
        await api.createProposal({
          inquiryId: inquiry.id,
          templateId: template?.id,
          proposalData,
        });
        toast.success("Proposal request submitted for approval");
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit proposal request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.clientName && formData.clientCompany;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px]! max-w-[90vw]! h-[85vh]! max-h-[85vh]! flex flex-col p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {inquiry?.proposalStatus === "rejected" ? "Revise Proposal" : "Create Proposal"}
            </DialogTitle>
            <DialogDescription>
              For {inquiry?.name} ({inquiry?.email})
            </DialogDescription>
          </DialogHeader>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                currentStep === 1
                  ? "bg-[#106934] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                1
              </span>
              Service Type
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                currentStep === 2
                  ? "bg-[#106934] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                2
              </span>
              Client Info
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                currentStep === 3
                  ? "bg-[#106934] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                3
              </span>
              Preview & Submit
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {/* Rejection Banner */}
          {inquiry?.proposalStatus === "rejected" && inquiry?.proposalRejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-900 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-700">{inquiry.proposalRejectionReason}</p>
            </div>
          )}

          {currentStep === 1 ? (
            /* STEP 1: Service Type Selection */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-base font-semibold">
                  Select Service Type <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-500">
                  Choose the type of service for this proposal. The appropriate template will be automatically selected.
                </p>
                <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger id="serviceType" className="w-full h-12 text-base">
                    <SelectValue placeholder="Select a service type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Auto-Selected Indicator */}
              {selectedServiceType && template && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Template Auto-Selected
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        <span className="font-semibold">{template.name}</span> will be used for this proposal
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isLoadingTemplate && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#106934]" />
                  <span className="ml-3 text-gray-600">Loading template...</span>
                </div>
              )}
            </div>
          ) : currentStep === 2 ? (
            /* STEP 2: Client Information Form */
            <div className="space-y-4 max-w-2xl mx-auto">
              {isLoadingTemplate ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#106934]" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">
                        Client Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPosition">Position/Title</Label>
                      <Input
                        id="clientPosition"
                        value={formData.clientPosition}
                        onChange={(e) => handleInputChange("clientPosition", e.target.value)}
                        placeholder="Operations Manager"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientCompany">
                        Company <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="clientCompany"
                        value={formData.clientCompany}
                        onChange={(e) => handleInputChange("clientCompany", e.target.value)}
                        placeholder="ABC Corporation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposalDate">Proposal Date</Label>
                      <Input
                        id="proposalDate"
                        type="date"
                        value={formData.proposalDate}
                        onChange={(e) => handleInputChange("proposalDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientAddress">Address</Label>
                    <Input
                      id="clientAddress"
                      value={formData.clientAddress}
                      onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                      placeholder="123 Business St, Metro Manila"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validityDays">Proposal Valid For (Days)</Label>
                    <Input
                      id="validityDays"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.validityDays}
                      onChange={(e) => handleInputChange("validityDays", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any additional notes for this proposal..."
                      rows={3}
                    />
                  </div>

                  {/* Template Info */}
                  {template && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <span className="text-gray-500">Using template: </span>
                      <span className="font-medium">{template.name}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* STEP 3: Preview */
            <div className="space-y-4 h-full flex flex-col">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-sm shrink-0">
                <p className="text-green-800 dark:text-green-100">
                  Preview of the proposal that will be sent to <strong>{formData.clientName}</strong>
                </p>
              </div>

              <div className="flex-1 border rounded-lg overflow-auto bg-white dark:bg-slate-950 min-h-0">
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center h-full py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-[#106934]" />
                  </div>
                ) : (
                  <div className="w-full h-full overflow-auto">
                    <iframe
                      srcDoc={previewHtml}
                      title="Proposal Preview"
                      className="w-full min-h-[600px] border-0"
                      sandbox="allow-same-origin"
                      style={{ height: "100%", minHeight: "600px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0">
          <DialogFooter className="gap-2">
            {currentStep === 1 ? (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedServiceType || isLoadingTemplate}
                >
                  {isLoadingTemplate ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Next
                </Button>
              </>
            ) : currentStep === 2 ? (
              <>
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={generatePreview}
                  disabled={!isFormValid || isLoadingPreview || isLoadingTemplate}
                >
                  {isLoadingPreview ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Preview
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isSubmitting}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Request
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
