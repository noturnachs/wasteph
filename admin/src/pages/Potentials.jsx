import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Search, Plus, Filter, Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Potentials = () => {
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
    const variants = {
      company_profile: {
        label: "Company Profile",
        className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
      },
      contacted: {
        label: "Contacted",
        className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      },
      not_yet_done: {
        label: "Not Yet Done",
        className: "bg-rose-100 text-rose-700 hover:bg-rose-100",
      },
    };
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Company Profile Stage
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {
                  potentials.filter((p) => p.status === "company_profile")
                    .length
                }
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-amber-700 mb-1">
                Contacted
              </p>
              <p className="text-3xl font-bold text-amber-900">
                {potentials.filter((p) => p.status === "contacted").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-rose-700 mb-1">
                Not Yet Done
              </p>
              <p className="text-3xl font-bold text-rose-900">
                {potentials.filter((p) => p.status === "not_yet_done").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search potentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
            Add Potential
          </Button>
        </div>
      </div>

      {/* Potentials Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Potential Clients ({filteredPotentials.length})</span>
            <span className="text-sm font-normal text-slate-600">
              Showing {filteredPotentials.length} of {potentials.length}{" "}
              potentials
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPotentials.map((potential) => (
                  <TableRow key={potential.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      {potential.companyName}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                        {potential.industry}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {potential.contactPerson}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {potential.email}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {potential.phone}
                    </TableCell>
                    <TableCell>{getStatusBadge(potential.status)}</TableCell>
                    <TableCell className="text-slate-600">
                      {potential.salesRep}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(potential.dateAdded).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Potentials;
