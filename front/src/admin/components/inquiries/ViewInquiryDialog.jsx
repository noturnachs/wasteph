import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../StatusBadge";
import { format } from "date-fns";

const SERVICE_TYPE_LABELS = {
  garbage_collection: "Garbage Collection",
  septic_siphoning: "Septic Siphoning",
  hazardous_waste: "Hazardous Waste",
  onetime_hauling: "One-time Hauling",
};

export function ViewInquiryDialog({ open, onOpenChange, inquiry, users = [] }) {
  if (!inquiry) return null;

  const assignedUser = users.find(u => u.id === inquiry.assignedTo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            View complete inquiry information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm font-medium">{inquiry.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-sm font-medium">{inquiry.company || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Inquiry Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {inquiry.serviceType && (
                <div>
                  <p className="text-sm text-muted-foreground">Type of Inquiry</p>
                  <p className="text-sm font-medium">{SERVICE_TYPE_LABELS[inquiry.serviceType] || inquiry.serviceType}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <p className="text-sm font-medium capitalize">{inquiry.source?.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge status={inquiry.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">
                  {assignedUser
                    ? `${assignedUser.firstName} ${assignedUser.lastName}`
                    : inquiry.assignedTo ? "Unknown User" : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {format(new Date(inquiry.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(inquiry.updatedAt), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Message</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>

          {inquiry.notes && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2 text-foreground">Internal Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {inquiry.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
