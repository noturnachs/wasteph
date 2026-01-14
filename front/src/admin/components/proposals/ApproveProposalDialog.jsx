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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

export function ApproveProposalDialog({ open, onOpenChange, proposal, onConfirm }) {
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(adminNotes);
      setAdminNotes(""); // Reset after success
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (isOpen) => {
    if (!isOpen && !isSubmitting) {
      setAdminNotes(""); // Reset on close
    }
    onOpenChange(isOpen);
  };

  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Approve Proposal
          </DialogTitle>
          <DialogDescription>
            This will approve the proposal and allow sales to send it to the client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Proposal Summary */}
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-semibold">{proposal.inquiryName}</p>
              <p className="text-sm text-muted-foreground">{proposal.inquiryEmail}</p>
            </div>
          </div>

          {/* Admin Notes (Optional) */}
          <div>
            <Label htmlFor="adminNotes">
              Admin Notes <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any internal notes about this approval..."
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              These notes are internal only and will not be sent to the client.
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Once approved, sales can send the proposal to the client.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Approving..." : "Approve Proposal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
