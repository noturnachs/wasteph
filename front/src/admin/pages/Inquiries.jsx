import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { toast } from "sonner";
import { Plus, Loader2, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { DataTable } from "../components/DataTable";
import { FacetedFilter } from "../components/FacetedFilter";
import { SearchInput } from "../components/SearchInput";
import { createColumns } from "./inquiries/columns";

export default function Inquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]); // Store all inquiries for counting
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    source: "phone",
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch all inquiries (for counts)
  useEffect(() => {
    fetchAllInquiries();
  }, []);

  // Fetch filtered inquiries
  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, sourceFilter, searchTerm]);

  const fetchAllInquiries = async () => {
    try {
      const response = await api.getInquiries({});
      setAllInquiries(response.data || response);
    } catch (error) {
      console.error("Failed to fetch all inquiries:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const response = await api.getInquiries({
        status: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
        source: sourceFilter.length > 0 ? sourceFilter.join(",") : undefined,
        search: searchTerm || undefined,
      });
      setInquiries(response.data || response);
    } catch (error) {
      toast.error(error.message || "Failed to fetch inquiries");
    } finally {
      setIsLoading(false);
    }
  };

  // Get count for each status from all inquiries
  const getStatusCount = (status) => {
    return allInquiries.filter((inquiry) => inquiry.status === status).length;
  };

  // Get count for each source from all inquiries
  const getSourceCount = (source) => {
    return allInquiries.filter((inquiry) => inquiry.source === source).length;
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.message?.trim()) {
      errors.message = "Message is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD Handlers
  const handleCreateInquiry = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createInquiry(formData);
      toast.success("Inquiry created successfully");
      setIsCreateDialogOpen(false);
      resetFormData();
      setFormErrors({});
      fetchAllInquiries();
      fetchInquiries();
    } catch (error) {
      toast.error(error.message || "Failed to create inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.updateInquiry(selectedInquiry.id, {
        status: formData.status,
        notes: formData.notes,
      });
      toast.success("Inquiry updated successfully");
      setIsEditDialogOpen(false);
      fetchAllInquiries();
      fetchInquiries();
    } catch (error) {
      toast.error(error.message || "Failed to update inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToLead = async () => {
    setIsSubmitting(true);
    try {
      await api.convertInquiryToLead(selectedInquiry.id);
      toast.success("Inquiry converted to lead successfully");
      setIsConvertDialogOpen(false);
      fetchAllInquiries();
      fetchInquiries();
    } catch (error) {
      toast.error(error.message || "Failed to convert inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInquiry = async (inquiry) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      await api.deleteInquiry(inquiry.id);
      toast.success("Inquiry deleted successfully");
      fetchAllInquiries();
      fetchInquiries();
    } catch (error) {
      toast.error(error.message || "Failed to delete inquiry");
    }
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      source: "phone",
    });
  };

  // Table columns setup
  const columns = createColumns({
    onEdit: (inquiry) => {
      setSelectedInquiry(inquiry);
      setFormData({
        status: inquiry.status,
        notes: inquiry.notes || "",
      });
      setIsEditDialogOpen(true);
    },
    onConvert: (inquiry) => {
      setSelectedInquiry(inquiry);
      setIsConvertDialogOpen(true);
    },
    onDelete: handleDeleteInquiry,
    userRole: user?.role,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">Manage inquiry leads</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Inquiry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search inquiries..."
          />

          <FacetedFilter
            title="Status"
            options={["new", "contacted", "qualified", "converted", "closed"]}
            selectedValues={statusFilter}
            onSelectionChange={setStatusFilter}
            getCount={getStatusCount}
          />

          <FacetedFilter
            title="Source"
            options={["website", "facebook", "email", "phone", "walk-in", "cold-approach"]}
            selectedValues={sourceFilter}
            onSelectionChange={setSourceFilter}
            getCount={getSourceCount}
          />
        </div>

        {/* View Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns
              .filter((column) => column.accessorKey)
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.accessorKey}
                    className="capitalize"
                    checked={true}
                  >
                    {column.accessorKey}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={inquiries}
        isLoading={isLoading}
        emptyMessage="No inquiries found"
        pageSize={10}
        showViewOptions={false}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inquiry</DialogTitle>
            <DialogDescription>
              Create a new inquiry from phone, email, or other sources
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateInquiry} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) {
                    setFormErrors({ ...formErrors, name: null });
                  }
                }}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Select
                value={formData.source}
                onValueChange={(val) =>
                  setFormData({ ...formData, source: val })
                }
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                  <SelectItem value="cold-approach">Cold Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) {
                    setFormErrors({ ...formErrors, message: null });
                  }
                }}
                className={formErrors.message ? "border-red-500" : ""}
              />
              {formErrors.message && (
                <p className="text-sm text-red-500 mt-1">{formErrors.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Inquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inquiry</DialogTitle>
            <DialogDescription>
              Update inquiry status and notes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateInquiry} className="space-y-4">
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
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Inquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Convert to Lead Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Lead</DialogTitle>
            <DialogDescription>
              This will create a new lead from this inquiry. You can add service
              details later in the Leads page.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-3">
              <div className="rounded-lg border p-4 space-y-2">
                <p>
                  <strong>Name:</strong> {selectedInquiry.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedInquiry.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedInquiry.phone || "N/A"}
                </p>
                <p>
                  <strong>Company:</strong> {selectedInquiry.company || "N/A"}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                The inquiry message will be added as a note in the lead. Service
                requirement fields (address, waste type, volume) can be filled
                in the Leads page.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConvertDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConvertToLead} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Convert to Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
