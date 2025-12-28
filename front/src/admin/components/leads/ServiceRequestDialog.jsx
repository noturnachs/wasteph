import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceRequestForm } from "./ServiceRequestForm";

export function ServiceRequestDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-300 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Service Request" : "Add Service Request"}
          </DialogTitle>
          <DialogDescription>
            Fill in the service details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <ServiceRequestForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
