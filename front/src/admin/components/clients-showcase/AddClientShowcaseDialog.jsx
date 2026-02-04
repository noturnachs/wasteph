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
import { Loader2 } from "lucide-react";
import { createClientShowcase } from "../../../services/clientsShowcaseService";
import { api } from "../../services/api";
import { toast } from "../../utils/toast";

export function AddClientShowcaseDialog({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company: "",
    logo: "",
    industry: "",
    location: "",
    employees: "",
    established: "",
    background: "",
    challenge: "",
    solution: "",
    testimonial: "",
    author: "",
    position: "",
    rating: 5,
    wasteReduction: "",
    partnership: "",
    achievements: [],
    achievementInput: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Clean up object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const validateForm = () => {
    const errors = {};
    if (!formData.company?.trim()) {
      errors.company = "Company name is required";
    }
    // Logo is now optional - will be uploaded separately
    if (!formData.industry?.trim()) {
      errors.industry = "Industry is required";
    }
    if (!formData.location?.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.background?.trim()) {
      errors.background = "Background is required";
    }
    if (!formData.testimonial?.trim()) {
      errors.testimonial = "Testimonial is required";
    }
    if (!formData.author?.trim()) {
      errors.author = "Author name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (including SVG for logos)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and SVG images are allowed");
      return;
    }

    // Validate file size (10MB for logos)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Logo size must be less than 10MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        logo: null, // Will be uploaded separately
        achievements: formData.achievements,
      };
      delete submitData.achievementInput;

      const newClient = await createClientShowcase(submitData);

      // Upload logo if selected
      if (logoFile) {
        try {
          await api.uploadClientShowcaseLogo(newClient.id, logoFile);
        } catch (uploadError) {
          console.error("Failed to upload logo:", uploadError);
          toast.error("Client showcase created but logo upload failed");
        }
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating client showcase:", error);
      const errorMessage = error.message || "Failed to create client showcase";
      setFormErrors({ submit: errorMessage });

      // Parse and display errors with proper line breaks
      const parts = errorMessage.split(": ");
      if (parts.length > 1 && parts[1].includes(" • ")) {
        const header = parts[0];
        const errors = parts[1].split(" • ");
        toast.error(
          <div className="space-y-1">
            <div className="font-semibold">{header}:</div>
            {errors.map((err, idx) => (
              <div key={idx} className="text-sm">
                • {err}
              </div>
            ))}
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: "",
      logo: "",
      industry: "",
      location: "",
      employees: "",
      established: "",
      background: "",
      challenge: "",
      solution: "",
      testimonial: "",
      author: "",
      position: "",
      rating: 5,
      wasteReduction: "",
      partnership: "",
      achievements: [],
      achievementInput: "",
    });
    setFormErrors({});
    // Clean up object URL before resetting
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddAchievement = () => {
    if (formData.achievementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, prev.achievementInput.trim()],
        achievementInput: "",
      }));
    }
  };

  const handleRemoveAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[95vh] max-w-4xl overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add New Client Showcase</DialogTitle>
          <DialogDescription>
            Create a new client success story to display on the website
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div
            className="space-y-4 overflow-y-auto px-1 py-4"
            style={{ maxHeight: "calc(90vh - 180px)" }}
          >
            {/* Company Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Enter company name"
                  className={formErrors.company ? "border-destructive" : ""}
                />
                {formErrors.company && (
                  <p className="text-sm text-destructive">
                    {formErrors.company}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-16 w-auto rounded object-contain"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, or SVG. Max 10MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">
                  Industry <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="e.g., Technology & Social Media"
                  className={formErrors.industry ? "border-destructive" : ""}
                />
                {formErrors.industry && (
                  <p className="text-sm text-destructive">
                    {formErrors.industry}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g., Metro Manila"
                  className={formErrors.location ? "border-destructive" : ""}
                />
                {formErrors.location && (
                  <p className="text-sm text-destructive">
                    {formErrors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="employees">Employees</Label>
                <Input
                  id="employees"
                  value={formData.employees}
                  onChange={(e) => handleChange("employees", e.target.value)}
                  placeholder="e.g., 500+"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="established">Established</Label>
                <Input
                  id="established"
                  value={formData.established}
                  onChange={(e) => handleChange("established", e.target.value)}
                  placeholder="e.g., 2018"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnership">Partnership</Label>
                <Input
                  id="partnership"
                  value={formData.partnership}
                  onChange={(e) => handleChange("partnership", e.target.value)}
                  placeholder="e.g., Since 2022"
                />
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label htmlFor="background">
                Background <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="background"
                value={formData.background}
                onChange={(e) => handleChange("background", e.target.value)}
                placeholder="Describe the client's background and context"
                rows={3}
                className={formErrors.background ? "border-destructive" : ""}
              />
              {formErrors.background && (
                <p className="text-sm text-destructive">
                  {formErrors.background}
                </p>
              )}
            </div>

            {/* Challenge */}
            <div className="space-y-2">
              <Label htmlFor="challenge">Challenge</Label>
              <Textarea
                id="challenge"
                value={formData.challenge}
                onChange={(e) => handleChange("challenge", e.target.value)}
                placeholder="What challenges did the client face?"
                rows={3}
              />
            </div>

            {/* Solution */}
            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => handleChange("solution", e.target.value)}
                placeholder="How did you help solve their challenges?"
                rows={3}
              />
            </div>

            {/* Testimonial */}
            <div className="space-y-2">
              <Label htmlFor="testimonial">
                Testimonial <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => handleChange("testimonial", e.target.value)}
                placeholder="Client testimonial or quote"
                rows={3}
                className={formErrors.testimonial ? "border-destructive" : ""}
              />
              {formErrors.testimonial && (
                <p className="text-sm text-destructive">
                  {formErrors.testimonial}
                </p>
              )}
            </div>

            {/* Author Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">
                  Author Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Name of person giving testimonial"
                  className={formErrors.author ? "border-destructive" : ""}
                />
                {formErrors.author && (
                  <p className="text-sm text-destructive">
                    {formErrors.author}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  placeholder="e.g., Sustainability Director"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    handleChange("rating", parseInt(e.target.value) || 5)
                  }
                  placeholder="1-5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wasteReduction">Waste Reduction</Label>
                <Input
                  id="wasteReduction"
                  value={formData.wasteReduction}
                  onChange={(e) =>
                    handleChange("wasteReduction", e.target.value)
                  }
                  placeholder="e.g., 60%"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements</Label>
              <div className="flex gap-2">
                <Input
                  id="achievements"
                  value={formData.achievementInput}
                  onChange={(e) =>
                    handleChange("achievementInput", e.target.value)
                  }
                  placeholder="Add achievement and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAchievement();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddAchievement}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {formData.achievements.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border bg-muted p-2"
                    >
                      <span className="text-sm">{achievement}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAchievement(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formErrors.submit && (
              <p className="text-sm text-destructive">{formErrors.submit}</p>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 border-t bg-background pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
