import { useState, useEffect } from "react";
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

const SERVICE_TYPES = [
  { value: "garbage_collection", label: "Garbage Collection" },
  { value: "septic_siphoning", label: "Septic Siphoning" },
  { value: "hazardous_waste", label: "Hazardous Waste" },
  { value: "onetime_hauling", label: "One-time Hauling" },
];

const SERVICE_MODES = [
  { value: "one_time", label: "One-time" },
  { value: "contract_based", label: "Contract-based" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function ServiceRequestForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    serviceType: "",
    serviceMode: "",
    serviceLocation: "",
    city: "",
    estimatedVolume: "",
    notes: "",
    priority: "medium",

    // Garbage Collection fields
    collectionFrequency: "",
    wasteType: "",
    containerInfo: "",
    pricingModel: "",

    // Septic Siphoning fields
    propertyType: "",
    lastSiphoningDate: "",
    estimatedTankSize: "",
    accessNotes: "",
    urgencyTargetDate: "",

    // Hazardous Waste fields
    hazardousCategory: "",
    packagingCondition: "",
    hazardousQuantity: "",
    storageCondition: "",
    complianceNotes: "",

    // One-time Hauling fields
    materialType: "",
    loadSize: "",
    preferredPickupDate: "",
    loadingConstraints: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceType) newErrors.serviceType = "Service type is required";
    if (!formData.serviceMode) newErrors.serviceMode = "Service mode is required";
    if (!formData.serviceLocation?.trim()) newErrors.serviceLocation = "Service location is required";

    // Service-specific validation
    if (formData.serviceType === "garbage_collection") {
      if (!formData.collectionFrequency) newErrors.collectionFrequency = "Collection frequency is required";
    } else if (formData.serviceType === "septic_siphoning") {
      if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    } else if (formData.serviceType === "hazardous_waste") {
      if (!formData.hazardousCategory?.trim()) newErrors.hazardousCategory = "Hazardous category is required";
    } else if (formData.serviceType === "onetime_hauling") {
      if (!formData.materialType?.trim()) newErrors.materialType = "Material type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderServiceSpecificFields = () => {
    switch (formData.serviceType) {
      case "garbage_collection":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="collectionFrequency">
                Collection Frequency <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.collectionFrequency}
                onValueChange={(value) => handleChange("collectionFrequency", value)}
              >
                <SelectTrigger id="collectionFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="three_times_week">3x per week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {errors.collectionFrequency && (
                <p className="text-sm text-destructive">{errors.collectionFrequency}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteType">Waste Type</Label>
              <Input
                id="wasteType"
                value={formData.wasteType}
                onChange={(e) => handleChange("wasteType", e.target.value)}
                placeholder="e.g., general, mixed, food"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="containerInfo">Container/Bin Info</Label>
              <Input
                id="containerInfo"
                value={formData.containerInfo}
                onChange={(e) => handleChange("containerInfo", e.target.value)}
                placeholder="Container details"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model</Label>
              <Select
                value={formData.pricingModel}
                onValueChange={(value) => handleChange("pricingModel", value)}
              >
                <SelectTrigger id="pricingModel">
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "septic_siphoning":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="propertyType">
                Property Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleChange("propertyType", value)}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-sm text-destructive">{errors.propertyType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastSiphoningDate">Last Siphoning Date</Label>
              <Input
                id="lastSiphoningDate"
                type="date"
                value={formData.lastSiphoningDate}
                onChange={(e) => handleChange("lastSiphoningDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTankSize">Estimated Tank Size</Label>
              <Input
                id="estimatedTankSize"
                value={formData.estimatedTankSize}
                onChange={(e) => handleChange("estimatedTankSize", e.target.value)}
                placeholder="e.g., 1000 gallons"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessNotes">Access Notes</Label>
              <Textarea
                id="accessNotes"
                value={formData.accessNotes}
                onChange={(e) => handleChange("accessNotes", e.target.value)}
                placeholder="Manhole location, truck access, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyTargetDate">Urgency/Target Date</Label>
              <Input
                id="urgencyTargetDate"
                type="date"
                value={formData.urgencyTargetDate}
                onChange={(e) => handleChange("urgencyTargetDate", e.target.value)}
              />
            </div>
          </>
        );

      case "hazardous_waste":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="hazardousCategory">
                Hazardous Waste Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hazardousCategory"
                value={formData.hazardousCategory}
                onChange={(e) => handleChange("hazardousCategory", e.target.value)}
                placeholder="e.g., Chemical, Biological, etc."
              />
              {errors.hazardousCategory && (
                <p className="text-sm text-destructive">{errors.hazardousCategory}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packagingCondition">Packaging Condition</Label>
              <Input
                id="packagingCondition"
                value={formData.packagingCondition}
                onChange={(e) => handleChange("packagingCondition", e.target.value)}
                placeholder="e.g., Sealed drums, loose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazardousQuantity">Estimated Quantity</Label>
              <Input
                id="hazardousQuantity"
                value={formData.hazardousQuantity}
                onChange={(e) => handleChange("hazardousQuantity", e.target.value)}
                placeholder="Quantity with unit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageCondition">Storage Condition</Label>
              <Textarea
                id="storageCondition"
                value={formData.storageCondition}
                onChange={(e) => handleChange("storageCondition", e.target.value)}
                placeholder="Current storage condition"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complianceNotes">Compliance Notes</Label>
              <Textarea
                id="complianceNotes"
                value={formData.complianceNotes}
                onChange={(e) => handleChange("complianceNotes", e.target.value)}
                placeholder="Permits needed, regulations, etc."
                rows={3}
              />
            </div>
          </>
        );

      case "onetime_hauling":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="materialType">
                Material Type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="materialType"
                value={formData.materialType}
                onChange={(e) => handleChange("materialType", e.target.value)}
                placeholder="e.g., construction debris, junk"
              />
              {errors.materialType && (
                <p className="text-sm text-destructive">{errors.materialType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loadSize">Estimated Load Size</Label>
              <Input
                id="loadSize"
                value={formData.loadSize}
                onChange={(e) => handleChange("loadSize", e.target.value)}
                placeholder="e.g., 1 truckload, 5 cubic meters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredPickupDate">Preferred Pickup Date</Label>
              <Input
                id="preferredPickupDate"
                type="date"
                value={formData.preferredPickupDate}
                onChange={(e) => handleChange("preferredPickupDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loadingConstraints">Loading Constraints/Manpower Notes</Label>
              <Textarea
                id="loadingConstraints"
                value={formData.loadingConstraints}
                onChange={(e) => handleChange("loadingConstraints", e.target.value)}
                placeholder="Any special requirements or constraints"
                rows={3}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Common Fields - Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceType">
            Service Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => handleChange("serviceType", value)}
          >
            <SelectTrigger id="serviceType">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceType && (
            <p className="text-sm text-destructive">{errors.serviceType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceMode">
            Service Mode <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.serviceMode}
            onValueChange={(value) => handleChange("serviceMode", value)}
          >
            <SelectTrigger id="serviceMode">
              <SelectValue placeholder="Select service mode" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_MODES.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceMode && (
            <p className="text-sm text-destructive">{errors.serviceMode}</p>
          )}
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="serviceLocation">
            Service Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="serviceLocation"
            value={formData.serviceLocation}
            onChange={(e) => handleChange("serviceLocation", e.target.value)}
            placeholder="Full address"
          />
          {errors.serviceLocation && (
            <p className="text-sm text-destructive">{errors.serviceLocation}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City/Area</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="City or area"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedVolume">Estimated Volume</Label>
          <Input
            id="estimatedVolume"
            value={formData.estimatedVolume}
            onChange={(e) => handleChange("estimatedVolume", e.target.value)}
            placeholder="e.g., 100 kg, 5 cubic meters"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange("priority", value)}
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">Notes/Description</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Additional notes or requirements"
            rows={2}
          />
        </div>
      </div>

      {/* Service-specific Fields */}
      {renderServiceSpecificFields()}

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update" : "Create"} Service Request
        </Button>
      </div>
    </form>
  );
}
