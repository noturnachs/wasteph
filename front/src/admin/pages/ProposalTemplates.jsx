import { useState, useEffect, useMemo } from "react";
import { Plus, Eye, Code, X, SlidersHorizontal, MoreHorizontal } from "lucide-react";
import { api } from "../services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "../components/DataTable";
import { SearchInput } from "../components/SearchInput";
import { FacetedFilter } from "../components/FacetedFilter";
import { TemplatePreviewDialog } from "../components/templates/TemplatePreviewDialog";
import { TemplateEditorDialog } from "../components/templates/TemplateEditorDialog";

// Service type mapping
const SERVICE_TYPES = {
  waste_collection: "Waste Collection (Compactor Hauling)",
  fixed_monthly: "Fixed Monthly Rate",
  waste_disposal: "Waste Disposal Services",
  recycling: "Recycling Services",
  consultation: "Environmental Consultation",
  emergency: "Emergency Waste Management",
};

const SERVICE_TYPE_OPTIONS = [
  { value: "waste_collection", label: "Waste Collection (Compactor Hauling)" },
  { value: "fixed_monthly", label: "Fixed Monthly Rate" },
  { value: "waste_disposal", label: "Waste Disposal Services" },
  { value: "recycling", label: "Recycling Services" },
  { value: "consultation", label: "Environmental Consultation" },
  { value: "emergency", label: "Emergency Waste Management" },
];

export default function ProposalTemplates() {
  const [templates, setTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]); // For counting
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState([]);

  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    serviceType: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  });

  // Dialog states
  const [previewDialog, setPreviewDialog] = useState({ open: false, template: null });
  const [editorDialog, setEditorDialog] = useState({ open: false, template: null });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [serviceTypeFilter, searchTerm]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.getProposalTemplates({ isActive: true });
      if (response.success) {
        // Handle paginated response structure
        const templatesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || response.data || []);
        
        // Debug: Check if htmlTemplate is included
        if (templatesData.length > 0) {
          console.log("Template data sample:", {
            id: templatesData[0].id,
            name: templatesData[0].name,
            hasHtmlTemplate: !!templatesData[0].htmlTemplate,
            htmlTemplateLength: templatesData[0].htmlTemplate?.length || 0,
            allKeys: Object.keys(templatesData[0])
          });
        }
        setAllTemplates(templatesData);

        // Apply filters
        let filtered = templatesData;

        // Service type filter
        if (serviceTypeFilter.length > 0) {
          filtered = filtered.filter(t =>
            serviceTypeFilter.includes(t.serviceType || "fixed_monthly")
          );
        }

        // Search filter
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(search) ||
            (t.description && t.description.toLowerCase().includes(search))
          );
        }

        setTemplates(filtered);
      }
    } catch (error) {
      toast.error("Failed to fetch proposal templates");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (template) => {
    setPreviewDialog({ open: true, template });
  };

  const handleEdit = (template) => {
    setEditorDialog({ open: true, template });
  };

  const handleCreateNew = () => {
    setEditorDialog({ open: true, template: null });
  };

  const handleSaveTemplate = async (templateData) => {
    try {
      if (editorDialog.template) {
        await api.updateProposalTemplate(editorDialog.template.id, templateData);
        toast.success("Template updated successfully");
      } else {
        await api.createProposalTemplate(templateData);
        toast.success("Template created successfully");
      }
      setEditorDialog({ open: false, template: null });
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || "Failed to save template");
      throw error;
    }
  };

  // Count function for service type filter
  const getServiceTypeCount = (value) => {
    return allTemplates.filter(t =>
      (t.serviceType || "fixed_monthly") === value
    ).length;
  };

  // Define table columns
  const allColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Template Name",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.description && (
              <div className="text-sm text-muted-foreground mt-0.5">
                {row.original.description}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "serviceType",
        header: "Service Type",
        cell: ({ row }) => {
          const serviceType = row.original.serviceType || "fixed_monthly";
          return (
            <Badge variant="outline">
              {SERVICE_TYPES[serviceType] || "Unknown Service"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          row.original.isDefault ? (
            <Badge className="bg-green-600">Default</Badge>
          ) : (
            <Badge variant="secondary">Active</Badge>
          )
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => handlePreview(row.original)} 
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Preview</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleEdit(row.original)} 
                className="cursor-pointer"
              >
                <Code className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  // Filter columns based on visibility
  const columns = allColumns.filter(column => {
    if (!column.accessorKey) return true; // Always show actions column
    return columnVisibility[column.accessorKey];
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposal Templates</h1>
          <p className="text-muted-foreground">
            Manage proposal templates for different service types
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search templates..."
          />

          <FacetedFilter
            title="Service Type"
            options={SERVICE_TYPE_OPTIONS}
            selectedValues={serviceTypeFilter}
            onSelectionChange={setServiceTypeFilter}
            getCount={getServiceTypeCount}
          />

          {(serviceTypeFilter.length > 0 || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setServiceTypeFilter([]);
                setSearchTerm("");
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* View Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel className="font-bold">Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allColumns
              .filter((column) => column.accessorKey)
              .map((column) => {
                const columnLabels = {
                  name: "Template Name",
                  serviceType: "Service Type",
                  status: "Status",
                  createdAt: "Created",
                  updatedAt: "Last Updated",
                };
                return (
                  <DropdownMenuCheckboxItem
                    key={column.accessorKey}
                    checked={columnVisibility[column.accessorKey]}
                    onCheckedChange={(value) =>
                      setColumnVisibility({
                        ...columnVisibility,
                        [column.accessorKey]: value,
                      })
                    }
                  >
                    {columnLabels[column.accessorKey]}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={templates}
        isLoading={loading}
        emptyMessage="No templates found. Create your first template to get started."
      />

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog({ open, template: null })}
        template={previewDialog.template}
      />

      {/* Editor Dialog */}
      <TemplateEditorDialog
        open={editorDialog.open}
        onOpenChange={(open) => setEditorDialog({ open, template: null })}
        template={editorDialog.template}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
