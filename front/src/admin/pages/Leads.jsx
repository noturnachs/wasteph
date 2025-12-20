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

const Leads = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with API call
  const leads = [
    {
      id: 1,
      name: "John Martinez",
      company: "BuildRight Construction",
      email: "john@buildright.com",
      phone: "+63 918 234 5678",
      contractType: "One Time Hauling",
      status: "contacted",
      date: "2024-12-15",
      lastUpdate: "2024-12-18",
      notes: "Construction debris removal needed",
    },
    {
      id: 2,
      name: "Lisa Garcia",
      company: "Harbor View Hotel",
      email: "lisa@harborview.com",
      phone: "+63 929 345 6789",
      contractType: "Garbage Collection",
      status: "qualified",
      date: "2024-12-10",
      lastUpdate: "2024-12-17",
      notes: "Looking for daily waste collection service",
    },
    {
      id: 3,
      name: "David Santos",
      company: "Prime Industrial Park",
      email: "david@primeindustrial.com",
      phone: "+63 930 456 7890",
      contractType: "Hazardous Waste",
      status: "proposal_sent",
      date: "2024-12-08",
      lastUpdate: "2024-12-16",
      notes: "Industrial waste management needed",
    },
    {
      id: 4,
      name: "Angela Reyes",
      company: "Skyline Apartments",
      email: "angela@skyline.com",
      phone: "+63 941 567 8901",
      contractType: "Garbage Collection",
      status: "contacted",
      date: "2024-12-12",
      lastUpdate: "2024-12-19",
      notes: "Residential building with 150 units",
    },
    {
      id: 5,
      name: "Mark Tan",
      company: "Fresh Foods Inc",
      email: "mark@freshfoods.com",
      phone: "+63 952 678 9012",
      contractType: "Garbage Collection",
      status: "new",
      date: "2024-12-20",
      lastUpdate: "2024-12-20",
      notes: "Food processing facility",
    },
  ];

  const getStatusBadge = (status) => {
    const variantsDark = {
      new: {
        label: "New",
        className:
          "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30",
      },
      contacted: {
        label: "Contacted",
        className:
          "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30",
      },
      qualified: {
        label: "Qualified",
        className:
          "bg-[#15803d]/20 text-[#15803d] border border-[#15803d]/30 hover:bg-[#15803d]/30",
      },
      proposal_sent: {
        label: "Proposal Sent",
        className:
          "bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30",
      },
      negotiating: {
        label: "Negotiating",
        className:
          "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30",
      },
    };

    const variantsLight = {
      new: {
        label: "New",
        className:
          "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200",
      },
      contacted: {
        label: "Contacted",
        className:
          "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200",
      },
      qualified: {
        label: "Qualified",
        className:
          "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200",
      },
      proposal_sent: {
        label: "Proposal Sent",
        className:
          "bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-200",
      },
      negotiating: {
        label: "Negotiating",
        className:
          "bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200",
      },
    };

    const variants = theme === "dark" ? variantsDark : variantsLight;
    const variant = variants[status] || variants.new;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card
          className={
            theme === "dark"
              ? "border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl"
              : "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100"
          }
        >
          <CardContent className="p-4">
            <div className="text-center">
              <p
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-blue-400" : "text-blue-700"
                }`}
              >
                New Leads
              </p>
              <p
                className={`text-2xl font-black ${
                  theme === "dark" ? "text-white" : "text-blue-900"
                }`}
              >
                {leads.filter((l) => l.status === "new").length}
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
          <CardContent className="p-4">
            <div className="text-center">
              <p
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-amber-400" : "text-amber-700"
                }`}
              >
                Contacted
              </p>
              <p
                className={`text-2xl font-black ${
                  theme === "dark" ? "text-white" : "text-amber-900"
                }`}
              >
                {leads.filter((l) => l.status === "contacted").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            theme === "dark"
              ? "border-[#15803d]/30 bg-gradient-to-br from-[#15803d]/20 to-[#16a34a]/10 backdrop-blur-xl"
              : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100"
          }
        >
          <CardContent className="p-4">
            <div className="text-center">
              <p
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                }`}
              >
                Qualified
              </p>
              <p
                className={`text-2xl font-black ${
                  theme === "dark" ? "text-white" : "text-emerald-900"
                }`}
              >
                {leads.filter((l) => l.status === "qualified").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={
            theme === "dark"
              ? "border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-violet-600/10 backdrop-blur-xl"
              : "border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100"
          }
        >
          <CardContent className="p-4">
            <div className="text-center">
              <p
                className={`mb-1 text-xs font-semibold uppercase tracking-wide ${
                  theme === "dark" ? "text-violet-400" : "text-violet-700"
                }`}
              >
                Proposals
              </p>
              <p
                className={`text-2xl font-black ${
                  theme === "dark" ? "text-white" : "text-violet-900"
                }`}
              >
                {leads.filter((l) => l.status === "proposal_sent").length}
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
            placeholder="Search leads..."
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
            Add Lead
          </Button>
        </div>
      </div>

      {/* Leads Table */}
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
              All Leads ({filteredLeads.length})
            </span>
            <span
              className={`text-sm font-normal ${
                theme === "dark" ? "text-white/50" : "text-slate-500"
              }`}
            >
              Showing {filteredLeads.length} of {leads.length} leads
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            mobileCards={filteredLeads.map((lead) => (
              <MobileCard key={lead.id}>
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
                        {lead.name}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          theme === "dark" ? "text-white/70" : "text-slate-600"
                        }`}
                      >
                        {lead.company}
                      </p>
                    </div>
                    {getStatusBadge(lead.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <MobileCardRow label="Email" value={lead.email} />
                    <MobileCardRow label="Phone" value={lead.phone} />
                    <MobileCardRow
                      label="Contract Type"
                      value={
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            theme === "dark"
                              ? "bg-white/10 text-white/70"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {lead.contractType}
                        </span>
                      }
                    />
                    <MobileCardRow
                      label="Date Added"
                      value={new Date(lead.date).toLocaleDateString()}
                    />
                    <MobileCardRow
                      label="Last Update"
                      value={new Date(lead.lastUpdate).toLocaleDateString()}
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
                    Name
                  </TableHead>
                  <TableHead
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Company
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
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Type
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
                    Updated
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
                {filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={
                      theme === "dark"
                        ? "border-white/10 transition-colors hover:bg-white/5"
                        : "border-slate-100 transition-colors hover:bg-slate-50"
                    }
                  >
                    <TableCell
                      className={`max-w-[130px] truncate font-medium ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {lead.name}
                    </TableCell>
                    <TableCell
                      className={`max-w-[150px] truncate ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {lead.company}
                    </TableCell>
                    <TableCell
                      className={`max-w-[140px] truncate text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {lead.email}
                    </TableCell>
                    <TableCell
                      className={`hidden max-w-[110px] truncate text-sm 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {lead.phone}
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <span
                        className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
                          theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {lead.contractType}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell
                      className={`hidden whitespace-nowrap text-sm 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {new Date(lead.lastUpdate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
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

export default Leads;
