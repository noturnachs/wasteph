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
import { Loader2 } from "lucide-react";
import { updateShowcase } from "../../../services/showcaseService";
import { api } from "../../services/api";
import { toast } from "../../utils/toast";
import { RichTextEditor } from "./RichTextEditor";

export function EditShowcaseDialog({ isOpen, onClose, onSuccess, showcase }) {
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    image: "",
    link: "",
    displayOrder: 0,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (showcase) {
      setFormData({
        title: showcase.title || "",
        tagline: showcase.tagline || "",
        description: showcase.description || "",
        image: showcase.image || "",
        link: showcase.link || "",
        displayOrder: showcase.displayOrder || 0,
      });
    }
  }, [showcase]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateShowcase(showcase.id, formData);

      // Upload new image if selected
      if (imageFile) {
        try {
          await api.uploadShowcaseImage(showcase.id, imageFile);
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
          toast.error("Showcase updated but image upload failed");
        }
      }

      setImageFile(null);
      setImagePreview(null);
      onSuccess();
    } catch (error) {
      console.error("Error updating showcase:", error);
      setFormErrors({ submit: error.message || "Failed to update showcase" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setFormErrors({});
      setImageFile(null);
      setImagePreview(null);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-7xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Showcase</DialogTitle>
          <DialogDescription>
            Update the showcase item details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="space-y-4 overflow-y-auto px-1 py-4" style={{ maxHeight: "calc(90vh - 180px)" }}>
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter showcase title"
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && (
                <p className="text-sm text-destructive">{formErrors.title}</p>
              )}
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Enter tagline (optional)"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {formData.description.replace(/<[^>]*>/g, '').length} characters
                </span>
              </div>
              
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Enter full description of the showcase event or initiative. Use the toolbar to format text with bold, italic, lists, and more."
                className={formErrors.description ? "border-destructive" : ""}
              />
              
              {formErrors.description && (
                <p className="text-sm text-destructive">
                  {formErrors.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Use the toolbar buttons to format text. Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+Z (undo), Ctrl+Y (redo)
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-full rounded object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WebP. Max 5MB. Leave empty to keep current image.
              </p>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">External Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://example.com (optional)"
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Optional link for "Read More" button
              </p>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  handleChange("displayOrder", parseInt(e.target.value) || 0)
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Higher numbers appear first
              </p>
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
                  Updating...
                </>
              ) : (
                "Update Showcase"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
