import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Info } from "lucide-react";
import { ServiceRequestDialog } from "../leads/ServiceRequestDialog";

export function ConvertToLeadDialog({
  open,
  onOpenChange,
  inquiry,
  onConvert,
  isSubmitting,
}) {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [currentServiceRequest, setCurrentServiceRequest] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);

  const handleSkipAndConvert = async () => {
    // Convert without any service details
    await onConvert({ serviceRequests: [] });
    resetState();
  };

  const handleConvertWithServices = async () => {
    // Convert with all service requests
    await onConvert({ serviceRequests });
    resetState();
  };

  const handleAddServiceRequest = (serviceData) => {
    setServiceRequests([...serviceRequests, serviceData]);
    setIsAddingService(false);
    setCurrentServiceRequest(null);
  };

  const handleRemoveServiceRequest = (index) => {
    setServiceRequests(serviceRequests.filter((_, i) => i !== index));
  };

  const resetState = () => {
    setServiceRequests([]);
    setCurrentServiceRequest(null);
    setIsAddingService(false);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const getServiceTypeLabel = (type) => {
    const labels = {
      garbage_collection: "Garbage Collection",
      septic_siphoning: "Septic Siphoning",
      hazardous_waste: "Hazardous Waste",
      onetime_hauling: "One-time Hauling",
    };
    return labels[type] || type;
  };

  const getServiceModeLabel = (mode) => {
    const labels = {
      one_time: "One-time",
      contract_based: "Contract-based",
    };
    return labels[mode] || mode;
  };

  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] w-300 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert Inquiry to Lead</DialogTitle>
          <DialogDescription>
            Convert this qualified inquiry to an active lead and add service requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Inquiry Details - Read Only */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Inquiry Details</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{inquiry.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{inquiry.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-sm font-medium">{inquiry.company || "-"}</p>
              </div>
            </div>
          </div>

          {/* Service Requests Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Service Requests</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Optional - Can be added later
                </span>
              </div>
              {!isAddingService && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingService(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service Request
                </Button>
              )}
            </div>

            {!isAddingService && serviceRequests.length === 0 && (
              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">No service requests added</p>
                  <p className="text-xs text-blue-700 mt-1">
                    You can skip this and add service details later by editing the lead
                  </p>
                </div>
              </div>
            )}

            {/* List of added service requests */}
            {serviceRequests.length > 0 && !isAddingService && (
              <div className="space-y-3">
                {serviceRequests.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-sm">
                            {getServiceTypeLabel(service.serviceType)}
                          </h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {getServiceModeLabel(service.serviceMode)}
                          </span>
                          {service.priority && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              service.priority === 'high' ? 'bg-red-100 text-red-800' :
                              service.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {service.priority.charAt(0).toUpperCase() + service.priority.slice(1)} Priority
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Location:</span> {service.serviceLocation}
                          </div>
                          {service.city && (
                            <div>
                              <span className="font-medium">City:</span> {service.city}
                            </div>
                          )}
                          {service.estimatedVolume && (
                            <div>
                              <span className="font-medium">Est. Volume:</span> {service.estimatedVolume}
                            </div>
                          )}
                          {service.notes && (
                            <div className="col-span-2 mt-1">
                              <span className="font-medium">Notes:</span> {service.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveServiceRequest(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={serviceRequests.length > 0 ? handleConvertWithServices : handleSkipAndConvert}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {serviceRequests.length > 0
              ? `Convert with ${serviceRequests.length} Service${serviceRequests.length > 1 ? 's' : ''}`
              : "Convert & Add Services Later"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Service Request Dialog */}
      <ServiceRequestDialog
        open={isAddingService}
        onOpenChange={setIsAddingService}
        initialData={currentServiceRequest}
        onSubmit={handleAddServiceRequest}
      />
    </Dialog>
  );
}
