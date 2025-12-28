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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const WASTE_TYPES = [
  "Industrial Waste",
  "Medical Waste",
  "Hazardous Waste",
  "Recyclable Waste",
  "Electronic Waste",
  "Construction Waste",
  "Organic Waste",
  "Other",
];

const PH_PROVINCES = [
  "Metro Manila (NCR)",
  "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay",
  "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes",
  "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan",
  "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz",
  "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro",
  "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental",
  "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao",
  "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga",
  "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte",
  "Maguindanao", "Marinduque", "Masbate", "Misamis Occidental",
  "Misamis Oriental", "Mountain Province", "Negros Occidental",
  "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya",
  "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga",
  "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar",
  "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte",
  "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur",
  "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte",
  "Zamboanga del Sur", "Zamboanga Sibugay",
];

export function EditLeadDialog({ open, onOpenChange, lead, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    wasteType: "",
    estimatedVolume: "",
    priority: "3",
    estimatedValue: "",
    notes: "",
    status: "new",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (lead && open) {
      setFormData({
        companyName: lead.companyName || "",
        contactPerson: lead.contactPerson || "",
        email: lead.email || "",
        phone: lead.phone || "",
        address: lead.address || "",
        city: lead.city || "",
        province: lead.province || "",
        wasteType: lead.wasteType || "",
        estimatedVolume: lead.estimatedVolume || "",
        priority: lead.priority?.toString() || "3",
        estimatedValue: lead.estimatedValue?.toString() || "",
        notes: lead.notes || "",
        status: lead.status || "new",
      });
    }
  }, [lead, open]);

  const validateForm = () => {
    const errors = {};
    if (!formData.companyName?.trim()) errors.companyName = "Company name is required.";
    if (!formData.contactPerson?.trim()) errors.contactPerson = "Contact person is required.";
    if (!formData.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone?.trim()) errors.phone = "Phone is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setFormErrors({});
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the lead information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-companyName">Company Name *</Label>
              <Input
                id="edit-companyName"
                value={formData.companyName}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value });
                  if (formErrors.companyName) {
                    setFormErrors({ ...formErrors, companyName: null });
                  }
                }}
                className={formErrors.companyName ? "border-red-500" : ""}
              />
              {formErrors.companyName && (
                <p className="text-sm text-red-500 mt-1">{formErrors.companyName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-contactPerson">Contact Person *</Label>
              <Input
                id="edit-contactPerson"
                value={formData.contactPerson}
                onChange={(e) => {
                  setFormData({ ...formData, contactPerson: e.target.value });
                  if (formErrors.contactPerson) {
                    setFormErrors({ ...formErrors, contactPerson: null });
                  }
                }}
                className={formErrors.contactPerson ? "border-red-500" : ""}
              />
              {formErrors.contactPerson && (
                <p className="text-sm text-red-500 mt-1">{formErrors.contactPerson}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (formErrors.email) {
                    setFormErrors({ ...formErrors, email: null });
                  }
                }}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (formErrors.phone) {
                    setFormErrors({ ...formErrors, phone: null });
                  }
                }}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-province">Province</Label>
              <Select
                value={formData.province}
                onValueChange={(val) =>
                  setFormData({ ...formData, province: val })
                }
              >
                <SelectTrigger id="edit-province">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PH_PROVINCES.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-wasteType">Waste Type</Label>
              <Select
                value={formData.wasteType}
                onValueChange={(val) =>
                  setFormData({ ...formData, wasteType: val })
                }
              >
                <SelectTrigger id="edit-wasteType">
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {WASTE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-estimatedVolume">Estimated Volume</Label>
              <Input
                id="edit-estimatedVolume"
                placeholder="e.g., 10 tons/month"
                value={formData.estimatedVolume}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedVolume: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(val) =>
                  setFormData({ ...formData, priority: val })
                }
              >
                <SelectTrigger id="edit-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Lowest</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 - Highest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-estimatedValue">Est. Value (PHP)</Label>
              <Input
                id="edit-estimatedValue"
                type="number"
                placeholder="0"
                value={formData.estimatedValue}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedValue: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
