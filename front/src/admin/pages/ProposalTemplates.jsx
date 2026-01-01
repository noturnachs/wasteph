import { useState, useEffect } from "react";
import { Plus, FileEdit, Check, X, Trash2, Eye, Search } from "lucide-react";
import { api } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ProposalTemplates() {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    htmlTemplate: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.getProposalTemplates({ isActive: true });
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch proposal templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      description: "",
      htmlTemplate: defaultTemplateHTML,
      isDefault: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      htmlTemplate: template.htmlTemplate,
      isDefault: template.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await api.updateProposalTemplate(editingTemplate.id, formData);
        toast.success("Template updated successfully");
      } else {
        await api.createProposalTemplate(formData);
        toast.success("Template created successfully");
      }
      setIsDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || "Failed to save template");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.setDefaultProposalTemplate(id);
      toast.success("Default template updated");
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to set default template");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      await api.deleteProposalTemplate(id);
      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || "Failed to delete template");
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Proposal Templates
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-white/60" : "text-slate-600"
            }`}
          >
            Manage proposal templates for your team
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className={theme === "dark" ? "text-white/60" : "text-slate-600"}>
            Loading templates...
          </p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileEdit className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className={theme === "dark" ? "text-white/60" : "text-slate-600"}>
              No templates found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description || "No description"}
                    </CardDescription>
                  </div>
                  {template.isDefault && (
                    <Badge variant="default" className="ml-2">
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(template)}
                  >
                    <FileEdit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {!template.isDefault && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(template.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Updated: {new Date(template.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update the proposal template details"
                : "Create a new proposal template"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Professional Proposal Template"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Template description..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="htmlTemplate">HTML Template</Label>
              <Textarea
                id="htmlTemplate"
                value={formData.htmlTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, htmlTemplate: e.target.value })
                }
                placeholder="HTML template with Handlebars placeholders..."
                rows={15}
                className="font-mono text-xs"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Use Handlebars syntax: &#123;&#123;clientName&#125;&#125;, &#123;&#123;#each services&#125;&#125;, &#123;&#123;currency pricing.total&#125;&#125;
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isDefault">Set as default template</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Default template HTML for new templates
const defaultTemplateHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .services-table { width: 100%; border-collapse: collapse; }
    .services-table th, .services-table td { padding: 10px; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Business Proposal</h1>
    <p>{{proposalDate}}</p>
  </div>

  <h3>Client Information</h3>
  <p>{{clientName}} - {{clientEmail}}</p>

  <h3>Services</h3>
  <table class="services-table">
    <thead>
      <tr>
        <th>Service</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {{#each services}}
      <tr>
        <td>{{this.name}}</td>
        <td>{{this.quantity}}</td>
        <td>{{currency this.unitPrice}}</td>
        <td>{{currency this.subtotal}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <h3>Total: {{currency pricing.total}}</h3>
</body>
</html>`;
