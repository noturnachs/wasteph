import { useState, useEffect, useRef } from "react";
import { toast } from "../utils/toast";
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { ClientCard } from "../components/clients-showcase/ClientCard";
import { AddClientShowcaseDialog } from "../components/clients-showcase/AddClientShowcaseDialog";
import { EditClientShowcaseDialog } from "../components/clients-showcase/EditClientShowcaseDialog";
import {
  fetchAllClientsShowcase,
  deleteClientShowcase,
  toggleClientShowcaseStatus,
} from "../../services/clientsShowcaseService";

const ClientsShowcase = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadClients();
    }
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchAllClientsShowcase();
      setClients(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter((c) => c.isActive).length || 0;
      const inactive = total - active;
      setStats({ total, active, inactive });
    } catch (error) {
      console.error("Error loading clients showcase:", error);
      if (
        error.message.includes("500") ||
        error.message.includes("Internal Server Error")
      ) {
        toast.error(
          "Database error. Please run 'npm run db:push' in the backend directory to create the clients_showcase table."
        );
      } else {
        toast.error("Failed to load clients showcase");
      }
      setClients([]);
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    hasFetchedRef.current = false;
    loadClients();
    toast.success("Client showcase created successfully");
  };

  const handleEditSuccess = () => {
    setEditingClient(null);
    hasFetchedRef.current = false;
    loadClients();
    toast.success("Client showcase updated successfully");
  };

  const handleToggleStatus = async (client) => {
    setTogglingId(client.id);
    try {
      await toggleClientShowcaseStatus(client.id);
      toast.success(
        `Client ${client.isActive ? "deactivated" : "activated"} successfully`
      );
      hasFetchedRef.current = false;
      loadClients();
    } catch (error) {
      console.error("Error toggling client status:", error);
      toast.error("Failed to toggle client status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClient) return;

    setDeletingId(deletingClient.id);
    try {
      await deleteClientShowcase(deletingClient.id);
      toast.success("Client showcase deleted successfully");
      setDeletingClient(null);
      hasFetchedRef.current = false;
      loadClients();
    } catch (error) {
      console.error("Error deleting client showcase:", error);
      toast.error("Failed to delete client showcase");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="dark:border-white/10 dark:bg-black/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="dark:border-white/10 dark:bg-black/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:border-white/10 dark:bg-black/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="dark:border-white/10 dark:bg-black/40">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Clients Showcase</CardTitle>
              <CardDescription>
                Manage client success stories displayed on the website
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-linear-to-r from-[#15803d] to-[#16a34a] hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Clients List */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#15803d]" />
                <p className="text-muted-foreground">Loading clients...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No clients found. Create your first client showcase to get
                  started.
                </p>
              </div>
            ) : (
              currentClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  togglingId={togglingId}
                  onToggleStatus={handleToggleStatus}
                  onEdit={setEditingClient}
                  onDelete={setDeletingClient}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && clients.length > itemsPerPage && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:border-white/10"
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? "bg-[#15803d] text-white hover:bg-[#15803d]/90"
                            : "dark:border-white/10"
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:border-white/10"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddClientShowcaseDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {editingClient && (
        <EditClientShowcaseDialog
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          onSuccess={handleEditSuccess}
          client={editingClient}
        />
      )}

      <Dialog
        open={!!deletingClient}
        onOpenChange={() => setDeletingClient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client Showcase</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingClient?.company}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingClient(null)}
              disabled={deletingId === deletingClient?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingId === deletingClient?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId === deletingClient?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsShowcase;
