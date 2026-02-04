import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Loader2,
  EyeOff,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function ClientCard({
  client,
  togglingId,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-lg border transition-all hover:shadow-lg border-slate-200 bg-white hover:border-[#15803d]/50 dark:border-white/10 dark:bg-white/5">
      {/* Logo Header */}
      {client.logoUrl && !imageError ? (
        <div className="relative h-32 w-full overflow-hidden bg-white">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-[#15803d]" />
            </div>
          )}

          <img
            src={client.logoUrl}
            alt={client.company}
            loading="lazy"
            decoding="async"
            className={`block h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ contentVisibility: "auto" }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-white">
          <Building2 className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left Section: Content */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {client.company}
              </h3>
              <Badge
                className={
                  client.isActive
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                }
              >
                {client.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {client.industry && (
              <p className="text-sm text-slate-600 dark:text-white/60">
                {client.industry} • {client.location}
              </p>
            )}
            {client.wasteReduction && (
              <p className="text-sm font-semibold text-[#16a34a]">
                {client.wasteReduction} waste reduction
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(client.createdAt)}</span>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex gap-2 sm:flex-col lg:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(client)}
              disabled={togglingId === client.id}
              className="flex-1 hover:bg-[#15803d]/10 hover:text-[#15803d] sm:flex-none"
            >
              {togglingId === client.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {client.isActive ? "Deactivating..." : "Activating..."}
                </>
              ) : client.isActive ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(client)}
              disabled={togglingId === client.id}
              className="hover:bg-[#15803d]/10 hover:text-[#15803d]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(client)}
              disabled={togglingId === client.id}
              className="hover:bg-red-500/10 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
