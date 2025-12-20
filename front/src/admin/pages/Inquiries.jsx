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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Edit,
  MoreVertical,
} from "lucide-react";
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

const Inquiries = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Mock data - replace with API call
  const inquiries = [
    {
      id: 1,
      companyName: "ABC Corporation",
      contactPerson: "John Doe",
      position: "Facilities Manager",
      email: "john@abc.com",
      phone: "+63 912 345 6789",
      source: "Facebook",
      serviceType: "Garbage Collection",
      status: "new",
      dateFirstContact: "2024-12-20",
      salesRep: "Maria Santos",
      notes: "Looking for weekly collection service for their office building.",
    },
    {
      id: 2,
      companyName: "XYZ Industries",
      contactPerson: "Jane Smith",
      position: "Operations Director",
      email: "jane@xyz.com",
      phone: "+63 923 456 7890",
      source: "Email",
      serviceType: "Septic Siphoning",
      status: "contacted",
      dateFirstContact: "2024-12-19",
      salesRep: "Juan Cruz",
      notes: "Urgent need for septic tank maintenance.",
    },
    {
      id: 3,
      companyName: "Tech Solutions Inc",
      contactPerson: "Mike Johnson",
      position: "Admin Manager",
      email: "mike@techsol.com",
      phone: "+63 934 567 8901",
      source: "Phone",
      serviceType: "Hazardous Waste",
      status: "qualified",
      dateFirstContact: "2024-12-18",
      salesRep: "Maria Santos",
      notes: "Chemical waste disposal from laboratory.",
    },
    {
      id: 4,
      companyName: "Green Plaza Condominiums",
      contactPerson: "Sarah Lee",
      position: "Property Manager",
      email: "sarah@greenplaza.com",
      phone: "+63 945 678 9012",
      source: "Facebook",
      serviceType: "Garbage Collection",
      status: "proposal",
      dateFirstContact: "2024-12-17",
      salesRep: "Juan Cruz",
      notes: "Residential building with 200 units.",
    },
    {
      id: 5,
      companyName: "Metro Restaurant Group",
      contactPerson: "Robert Chen",
      position: "General Manager",
      email: "robert@metrorest.com",
      phone: "+63 956 789 0123",
      source: "Cold Approach",
      serviceType: "One Time Hauling",
      status: "new",
      dateFirstContact: "2024-12-16",
      salesRep: "Maria Santos",
      notes: "Renovation debris removal needed.",
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
      proposal: {
        label: "Proposal Sent",
        className:
          "bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30",
      },
      won: {
        label: "Won",
        className:
          "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30",
      },
      lost: {
        label: "Lost",
        className:
          "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
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
      proposal: {
        label: "Proposal Sent",
        className:
          "bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-200",
      },
      won: {
        label: "Won",
        className:
          "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200",
      },
      lost: {
        label: "Lost",
        className:
          "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200",
      },
    };

    const variants = theme === "dark" ? variantsDark : variantsLight;
    const variant = variants[status] || variants.new;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getSourceIcon = (source) => {
    const iconsDark = {
      Facebook: <MessageSquare className="h-4 w-4 text-blue-400" />,
      Email: <Mail className="h-4 w-4 text-white/60" />,
      Phone: <Phone className="h-4 w-4 text-[#15803d]" />,
      "Cold Approach": <Phone className="h-4 w-4 text-violet-400" />,
    };

    const iconsLight = {
      Facebook: <MessageSquare className="h-4 w-4 text-blue-600" />,
      Email: <Mail className="h-4 w-4 text-slate-600" />,
      Phone: <Phone className="h-4 w-4 text-emerald-600" />,
      "Cold Approach": <Phone className="h-4 w-4 text-violet-600" />,
    };

    const icons = theme === "dark" ? iconsDark : iconsLight;
    return icons[source] || <MessageSquare className="h-4 w-4" />;
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 justify-between sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
              theme === "dark" ? "text-white/40" : "text-slate-400"
            }`}
          />
          <Input
            placeholder="Search inquiries..."
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
            className={`flex-1 gap-2 sm:flex-initial ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="sm:inline">Filter</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2 bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white hover:shadow-[0_0_30px_rgba(21,128,61,0.4)] sm:flex-initial">
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Add Inquiry</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`max-w-2xl backdrop-blur-xl ${
                theme === "dark"
                  ? "border-white/10 bg-black/95 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <DialogHeader>
                <DialogTitle
                  className={theme === "dark" ? "text-white" : "text-slate-900"}
                >
                  Add New Inquiry
                </DialogTitle>
                <DialogDescription
                  className={
                    theme === "dark" ? "text-white/60" : "text-slate-600"
                  }
                >
                  Enter the details of the new inquiry below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Company Name
                  </label>
                  <Input
                    placeholder="ABC Corporation"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Contact Person
                  </label>
                  <Input
                    placeholder="John Doe"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Position
                  </label>
                  <Input
                    placeholder="Facilities Manager"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@abc.com"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Phone
                  </label>
                  <Input
                    placeholder="+63 912 345 6789"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Service Type
                  </label>
                  <Input
                    placeholder="Garbage Collection"
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Notes
                  </label>
                  <Input
                    placeholder="Additional notes..."
                    className={
                      theme === "dark"
                        ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
                        : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className={
                    theme === "dark"
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                  }
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-[#15803d] to-[#16a34a] text-white hover:shadow-[0_0_30px_rgba(21,128,61,0.4)]">
                  Save Inquiry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inquiries Table */}
      <Card
        className={
          theme === "dark"
            ? "border-white/10 bg-black/40 backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }
      >
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <span
              className={`text-base font-bold sm:text-lg ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              All Inquiries ({filteredInquiries.length})
            </span>
            <span
              className={`text-xs font-normal sm:text-sm ${
                theme === "dark" ? "text-white/50" : "text-slate-500"
              }`}
            >
              Showing {filteredInquiries.length} of {inquiries.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ResponsiveTable
            mobileCards={filteredInquiries.map((inquiry) => (
              <MobileCard key={inquiry.id}>
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
                        {inquiry.companyName}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          theme === "dark" ? "text-white/70" : "text-slate-600"
                        }`}
                      >
                        {inquiry.contactPerson}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          theme === "dark" ? "text-white/50" : "text-slate-500"
                        }`}
                      >
                        {inquiry.position}
                      </p>
                    </div>
                    {getStatusBadge(inquiry.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <MobileCardRow label="Email" value={inquiry.email} />
                    <MobileCardRow label="Phone" value={inquiry.phone} />
                    <MobileCardRow
                      label="Service"
                      value={
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            theme === "dark"
                              ? "bg-white/10 text-white/70"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {inquiry.serviceType}
                        </span>
                      }
                    />
                    <MobileCardRow
                      label="Source"
                      value={
                        <span className="flex items-center gap-1.5">
                          {getSourceIcon(inquiry.source)}
                          {inquiry.source}
                        </span>
                      }
                    />
                    <MobileCardRow label="Sales Rep" value={inquiry.salesRep} />
                    <MobileCardRow
                      label="Date"
                      value={new Date(
                        inquiry.dateFirstContact
                      ).toLocaleDateString()}
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
                      onClick={() => setSelectedInquiry(inquiry)}
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
                    className={
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }
                  >
                    Phone
                  </TableHead>
                  <TableHead
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Service
                  </TableHead>
                  <TableHead
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Source
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
                    className={`hidden 2xl:table-cell ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    Date
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
                {filteredInquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
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
                      {inquiry.companyName}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[120px]">
                        <div
                          className={`truncate font-medium ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {inquiry.contactPerson}
                        </div>
                        <div
                          className={`truncate text-xs ${
                            theme === "dark"
                              ? "text-white/50"
                              : "text-slate-500"
                          }`}
                        >
                          {inquiry.position}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`max-w-[140px] truncate text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {inquiry.email}
                    </TableCell>
                    <TableCell
                      className={`max-w-[110px] truncate text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {inquiry.phone}
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <span
                        className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${
                          theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {inquiry.serviceType}
                      </span>
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {getSourceIcon(inquiry.source)}
                        <span
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-white/70"
                              : "text-slate-600"
                          }`}
                        >
                          {inquiry.source}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell
                      className={`hidden max-w-[100px] truncate 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {inquiry.salesRep}
                    </TableCell>
                    <TableCell
                      className={`hidden whitespace-nowrap text-sm 2xl:table-cell ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {new Date(inquiry.dateFirstContact).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
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
                            onClick={() => setSelectedInquiry(inquiry)}
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

      {/* View Details Dialog */}
      {selectedInquiry && (
        <Dialog
          open={!!selectedInquiry}
          onOpenChange={() => setSelectedInquiry(null)}
        >
          <DialogContent
            className={`max-w-2xl backdrop-blur-xl ${
              theme === "dark"
                ? "border-white/10 bg-black/95 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <DialogHeader>
              <DialogTitle
                className={theme === "dark" ? "text-white" : "text-slate-900"}
              >
                {selectedInquiry.companyName}
              </DialogTitle>
              <DialogDescription
                className={
                  theme === "dark" ? "text-white/60" : "text-slate-600"
                }
              >
                Inquiry Details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Contact Person
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.contactPerson}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Position
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.position}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Email
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.email}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Phone
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.phone}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Service Type
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.serviceType}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Source
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.source}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                </div>
                <div>
                  <label
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                    }`}
                  >
                    Sales Rep
                  </label>
                  <p
                    className={
                      theme === "dark" ? "text-white" : "text-slate-900"
                    }
                  >
                    {selectedInquiry.salesRep}
                  </p>
                </div>
              </div>
              <div>
                <label
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    theme === "dark" ? "text-[#15803d]" : "text-emerald-700"
                  }`}
                >
                  Notes
                </label>
                <p
                  className={`mt-1 ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {selectedInquiry.notes}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Inquiries;
