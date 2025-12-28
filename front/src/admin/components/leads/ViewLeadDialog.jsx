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

export function ViewLeadDialog({ open, onOpenChange, lead, users = [] }) {
  if (!lead) return null;

  const assignedUser = users.find(u => u.id === lead.assignedTo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            View complete lead information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="text-sm font-medium">{lead.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="text-sm font-medium">{lead.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{lead.phone}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Street Address</p>
                <p className="text-sm font-medium">{lead.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="text-sm font-medium">{lead.city || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Province</p>
                <p className="text-sm font-medium">{lead.province || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Lead Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge status={lead.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className="text-sm font-medium">{lead.priority}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waste Type</p>
                <p className="text-sm font-medium">{lead.wasteType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Volume</p>
                <p className="text-sm font-medium">{lead.estimatedVolume || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-sm font-medium">
                  {lead.estimatedValue ? `₱${lead.estimatedValue.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">
                  {assignedUser
                    ? `${assignedUser.firstName} ${assignedUser.lastName}`
                    : lead.assignedTo ? "Unknown User" : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {format(new Date(lead.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(lead.updatedAt), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-2 text-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {lead.notes}
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
