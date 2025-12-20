import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Filter, Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResponsiveTable, {
  MobileCard,
  MobileCardRow,
} from "../components/common/ResponsiveTable";
import { useTheme } from "../contexts/ThemeContext";

const Potentials = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with API call
  const potentials = [
    {
      id: 1,
      companyName: "Future Tower Development",
      industry: "Real Estate",
      contactPerson: "Ricardo Lopez",
      email: "ricardo@futuretower.com",
      phone: "+63 915 234 5678",
      status: "company_profile",
      dateAdded: "2024-12-18",
      salesRep: "Maria Santos",
      notes:
        "New building under construction, potential for waste collection contract starting Q2 2025",
    },
    {
      id: 2,
      companyName: "Mega Mart Chain",
      industry: "Retail",
      contactPerson: "Carmen Velasco",
      email: "carmen@megamart.com",
      phone: "+63 926 345 6789",
      status: "contacted",
      dateAdded: "2024-12-10",
      salesRep: "Juan Cruz",
      notes: "Interested in waste management for 5 branches",
    },
    {
      id: 3,
      companyName: "Pacific Manufacturing Corp",
      industry: "Manufacturing",
      contactPerson: "Henry Lim",
      email: "henry@pacificmfg.com",
      phone: "+63 937 456 7890",
      status: "not_yet_done",
      dateAdded: "2024-12-05",
      salesRep: "Maria Santos",
      notes: "Factory expansion planned, needs hazardous waste disposal",
    },
    {
      id: 4,
      companyName: "Bayview Medical Center",
      industry: "Healthcare",
      contactPerson: "Dr. Maria Santos",
      email: "msantos@bayviewmed.com",
      phone: "+63 948 567 8901",
      status: "contacted",
      dateAdded: "2024-11-28",
      salesRep: "Juan Cruz",
      notes: "Medical waste disposal needed, awaiting meeting schedule",
    },
    {
      id: 5,
      companyName: "Golden Years Retirement Home",
      industry: "Healthcare",
      contactPerson: "Anna Ramirez",
      email: "anna@goldenyears.com",
      phone: "+63 959 678 9012",
      status: "company_profile",
      dateAdded: "2024-12-15",
      salesRep: "Maria Santos",
      notes: "Research stage - understanding their waste management needs",
    },
  ];

  const getStatusBadge = (status) => {
    const variantsDark = {
      company_profile: {
        label: "Company Profile",
        className:
          "bg-slate-500/20 text-slate-300 border border-slate-500/30 hover:bg-slate-500/30",
      },
      contacted: {
        label: "Contacted",
        className:
          "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30",
      },
      not_yet_done: {
        label: "Not Yet Done",
        className:
          "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30",
      },
    };

    const variantsLight = {
      company_profile: {
        label: "Company Profile",
        className:
          "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200",
      },
      contacted: {
        label: "Contacted",
        className:
          "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200",
      },
      not_yet_done: {
        label: "Not Yet Done",
        className:
          "bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200",
      },
    };

    const variants = theme === "dark" ? variantsDark : variantsLight;
    const variant = variants[status] || variants.not_yet_done;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredPotentials = potentials.filter(
    (potential) =>
      potential.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      potential.contactPerson
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      potential.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card
          className={
            theme === "dark"
              ? "border-slate-500/30 bg-gradient-to-br from-slate-500/20 to-slate-600/10 backdrop-blur-xl"
              : "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100"
          }
        >
          <CardContent className="p-6">
            <div className="text-center">
              <p
                className={`mb-1 text-sm font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Company Profile Stage
              </p>
              <p
                className={`text-3xl font-black ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {
                  potentials.filter((p) => p.status === "company_profile")
                    .length
                }
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            theme === "dark"
              ? "border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-xl"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100"
          }
        >
          <CardContent className="p-6">
            <div className="text-center">
              <p
                className={`mb-1 text-sm font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-amber-400" : "text-amber-700"
                }`}
              >
                Contacted
              </p>
              <p
                className={`text-3xl font-black ${
                  theme === "dark" ? "text-white" : "text-amber-900"
                }`}
              >
                {potentials.filter((p) => p.status === "contacted").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            theme === "dark"
              ? "border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-rose-600/10 backdrop-blur-xl"
              : "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100"
          }
        >
          <CardContent className="p-6">
            <div className="text-center">
              <p
                className={`mb-1 text-sm font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-rose-400" : "text-rose-700"
                }`}
              >
                Not Yet Done
              </p>
              <p
                className={`text-3xl font-black ${
                  theme === "dark" ? "text-white" : "text-rose-900"
                }`}
              >
                {potentials.filter((p) => p.status === "not_yet_done").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col gap-4 justify-between sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
              theme === "dark" ? "text-white/40" : "text-slate-400"
            }`}
          />
          <Input
            placeholder="Search potentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`h-11 pl-10 ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#15803d]/50 focus:bg-white/10"
                : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500"
            }`}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`gap-2 ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white hover:shadow-[0_0_30px_rgba(21,128,61,0.4)]">
            <Plus className="h-4 w-4" />
            Add Potential
          </Button>
        </div>
      </div>

      {/* Potentials Table */}
      <Card
        className={
          theme === "dark"
            ? "border-white/10 bg-black/40 backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span
              className={theme === "dark" ? "text-white" : "text-slate-900"}
            >
              Potential Clients ({filteredPotentials.length})
            </span>
            <span
              className={`text-sm font-normal ${
                theme === "dark" ? "text-white/50" : "text-slate-500"
              }`}
            >
              Showing {filteredPotentials.length} of {potentials.length}{" "}
              potentials
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            mobileCards={filteredPotentials.map((potential) => (
              <MobileCard key={potential.id}>
                <div className="space-y-3">
                  <div
                    className={`flex items-start justify-between gap-3 pb-3 border-b ${
                      theme === "dark" ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold truncate mb-1 ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {potential.companyName}
                      </h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          theme === "dark"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {potential.industry}
                      </span>
                    </div>
                    {getStatusBadge(potential.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <MobileCardRow
                      label="Contact"
                      value={potential.contactPerson}
                    />
                    <MobileCardRow label="Email" value={potential.email} />
                    <MobileCardRow label="Phone" value={potential.phone} />
                    <MobileCardRow
                      label="Sales Rep"
                      value={potential.salesRep}
                    />
                    <MobileCardRow
                      label="Date Added"
                      value={new Date(potential.dateAdded).toLocaleDateString()}
                    />
                  </div>

                  <div
                    className={`flex gap-2 pt-2 border-t ${
                      theme === "dark" ? "border-white/10" : "border-slate-200"
                    }`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 text-xs ${
                        theme === "dark"
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                          : "border-slate-300 text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 text-xs ${
                        theme === "dark"
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                          : "border-slate-300 text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </MobileCard>
            ))}
          >
            <Table>
              <TableHeader>
                <TableRow
                  className={
                    theme === "dark"
                      ? "border-white/10 hover:bg-white/5"
                      : "border-slate-200"
                  }
                >
                  <TableHead
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Company
                  </TableHead>
                  <TableHead
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Industry
                  </TableHead>
                  <TableHead
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Contact
                  </TableHead>
                  <TableHead
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Email
                  </TableHead>
                  <TableHead
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Phone
                  </TableHead>
                  <TableHead
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Sales Rep
                  </TableHead>
                  <TableHead
                    className={`text-right ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPotentials.map((potential) => (
                  <TableRow
                    key={potential.id}
                    className={
                      theme === "dark"
                        ? "border-white/10 transition-colors hover:bg-white/5"
                        : "border-slate-100 transition-colors hover:bg-slate-50"
                    }
                  >
                    <TableCell
                      className={`max-w-[150px] truncate font-medium ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {potential.companyName}
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <span
                        className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
                          theme === "dark"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {potential.industry}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`max-w-[120px] truncate ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {potential.contactPerson}
                    </TableCell>
                    <TableCell
                      className={`max-w-[140px] truncate text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {potential.email}
                    </TableCell>
                    <TableCell
                      className={`hidden max-w-[110px] truncate text-sm 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {potential.phone}
                    </TableCell>
                    <TableCell>{getStatusBadge(potential.status)}</TableCell>
                    <TableCell
                      className={`hidden 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {potential.salesRep}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              theme === "dark"
                                ? "text-white/60 hover:bg-white/10 hover:text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className={
                            theme === "dark"
                              ? "border-white/10 bg-black/95 text-white backdrop-blur-xl"
                              : "border-slate-200 bg-white text-slate-900"
                          }
                        >
                          <DropdownMenuItem
                            className={
                              theme === "dark"
                                ? "hover:bg-white/10 focus:bg-white/10"
                                : "hover:bg-slate-100 focus:bg-slate-100"
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={
                              theme === "dark"
                                ? "hover:bg-white/10 focus:bg-white/10"
                                : "hover:bg-slate-100 focus:bg-slate-100"
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
};

export default Potentials;
