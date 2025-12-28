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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Info } from "lucide-react";

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
  "Abra",
  "Agusan del Norte",
  "Agusan del Sur",
  "Aklan",
  "Albay",
  "Antique",
  "Apayao",
  "Aurora",
  "Basilan",
  "Bataan",
  "Batanes",
  "Batangas",
  "Benguet",
  "Biliran",
  "Bohol",
  "Bukidnon",
  "Bulacan",
  "Cagayan",
  "Camarines Norte",
  "Camarines Sur",
  "Camiguin",
  "Capiz",
  "Catanduanes",
  "Cavite",
  "Cebu",
  "Cotabato",
  "Davao de Oro",
  "Davao del Norte",
  "Davao del Sur",
  "Davao Occidental",
  "Davao Oriental",
  "Dinagat Islands",
  "Eastern Samar",
  "Guimaras",
  "Ifugao",
  "Ilocos Norte",
  "Ilocos Sur",
  "Iloilo",
  "Isabela",
  "Kalinga",
  "La Union",
  "Laguna",
  "Lanao del Norte",
  "Lanao del Sur",
  "Leyte",
  "Maguindanao",
  "Marinduque",
  "Masbate",
  "Misamis Occidental",
  "Misamis Oriental",
  "Mountain Province",
  "Negros Occidental",
  "Negros Oriental",
  "Northern Samar",
  "Nueva Ecija",
  "Nueva Vizcaya",
  "Occidental Mindoro",
  "Oriental Mindoro",
  "Palawan",
  "Pampanga",
  "Pangasinan",
  "Quezon",
  "Quirino",
  "Rizal",
  "Romblon",
  "Samar",
  "Sarangani",
  "Siquijor",
  "Sorsogon",
  "South Cotabato",
  "Southern Leyte",
  "Sultan Kudarat",
  "Sulu",
  "Surigao del Norte",
  "Surigao del Sur",
  "Tarlac",
  "Tawi-Tawi",
  "Zambales",
  "Zamboanga del Norte",
  "Zamboanga del Sur",
  "Zamboanga Sibugay",
];

export function ConvertToLeadDialog({
  open,
  onOpenChange,
  inquiry,
  onConvert,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    wasteType: "",
    estimatedVolume: "",
    address: "",
    city: "",
    province: "",
    priority: "3",
    estimatedValue: "",
    notes: "",
  });

  const handleSkipAndConvert = async () => {
    // Convert without any service details
    await onConvert({});
  };

  const handleConvertWithDetails = async () => {
    // Convert with form data (filter out empty values)
    const serviceDetails = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        serviceDetails[key] = formData[key];
      }
    });
    await onConvert(serviceDetails);
  };

  const resetForm = () => {
    setFormData({
      wasteType: "",
      estimatedVolume: "",
      address: "",
      city: "",
      province: "",
      priority: "3",
      estimatedValue: "",
      notes: "",
    });
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  // Check if all service detail fields are filled
  const allFieldsFilled = () => {
    return (
      formData.wasteType &&
      formData.estimatedVolume &&
      formData.address &&
      formData.city &&
      formData.province &&
      formData.estimatedValue
    );
  };

  // Check if at least one service detail field is filled
  const hasAnyServiceDetails = () => {
    return (
      formData.wasteType ||
      formData.estimatedVolume ||
      formData.address ||
      formData.city ||
      formData.province ||
      formData.estimatedValue ||
      formData.notes
    );
  };

  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert Inquiry to Lead</DialogTitle>
          <DialogDescription>
            Convert this qualified inquiry to an active lead in your sales
            pipeline
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

          {/* Service Details - Optional */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold">
                Service Details (Optional)
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Can be added later
              </span>
            </div>
            <div className="flex items-start gap-2 mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
                You can skip this section and add details later by editing the
                lead
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="wasteType">Waste Type</Label>
                <Select
                  value={formData.wasteType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, wasteType: value })
                  }
                >
                  <SelectTrigger id="wasteType">
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
                <Label htmlFor="estimatedVolume">Estimated Volume</Label>
                <Input
                  id="estimatedVolume"
                  placeholder="e.g., 10 tons/month"
                  value={formData.estimatedVolume}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedVolume: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="province">Province</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    setFormData({ ...formData, province: value })
                  }
                >
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Province" />
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
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedValue">Est. Value</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  placeholder="0"
                  value={formData.estimatedValue}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedValue: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
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
            onClick={hasAnyServiceDetails() ? handleConvertWithDetails : handleSkipAndConvert}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {allFieldsFilled()
              ? "Convert to Lead"
              : "Convert & Add Details Later"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
