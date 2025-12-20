import { useState, useEffect } from "react";
import DashboardCard from "../components/common/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../services/api";

const Dashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState([
    {
      title: "Total Inquiries",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: UserPlus,
      color: "emerald",
    },
    {
      title: "Active Leads",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Potentials",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: FileText,
      color: "amber",
    },
    {
      title: "Contracted Clients",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "violet",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [inquiries, leads, potentials, clients] = await Promise.all([
        api.getInquiries(),
        api.getLeads(),
        api.getPotentials(),
        api.getClients(),
      ]);

      setStats([
        {
          title: "Total Inquiries",
          value: inquiries.data?.length.toString() || "0",
          change: "+0%",
          trend: "up",
          icon: UserPlus,
          color: "emerald",
        },
        {
          title: "Active Leads",
          value: leads.data?.length.toString() || "0",
          change: "+0%",
          trend: "up",
          icon: TrendingUp,
          color: "blue",
        },
        {
          title: "Potentials",
          value: potentials.data?.length.toString() || "0",
          change: "+0%",
          trend: "up",
          icon: FileText,
          color: "amber",
        },
        {
          title: "Contracted Clients",
          value: clients.data?.length.toString() || "0",
          change: "+0%",
          trend: "up",
          icon: Users,
          color: "violet",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const recentInquiries = [
    {
      id: 1,
      company: "ABC Corporation",
      contact: "John Doe",
      service: "Garbage Collection",
      source: "Facebook",
      status: "new",
      date: "2024-12-20",
    },
    {
      id: 2,
      company: "XYZ Industries",
      contact: "Jane Smith",
      service: "Septic Siphoning",
      source: "Email",
      status: "contacted",
      date: "2024-12-19",
    },
    {
      id: 3,
      company: "Tech Solutions Inc",
      contact: "Mike Johnson",
      service: "Hazardous Waste",
      source: "Phone",
      status: "qualified",
      date: "2024-12-18",
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      new: {
        label: "New",
        className:
          theme === "dark"
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
            : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200",
      },
      contacted: {
        label: "Contacted",
        className:
          theme === "dark"
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
            : "bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200",
      },
      qualified: {
        label: "Qualified",
        className:
          theme === "dark"
            ? "bg-[#15803d]/20 text-[#15803d] border border-[#15803d]/30 hover:bg-[#15803d]/30"
            : "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200",
      },
    };
    const variant = variants[status] || variants.new;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        {/* Recent Inquiries */}
        <Card
          className={
            theme === "dark"
              ? "border-white/10 bg-black/40 backdrop-blur-xl"
              : "border-slate-200 bg-white shadow-sm"
          }
        >
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle
              className={`flex items-center gap-2 text-base sm:text-lg ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0 text-[#15803d] sm:h-5 sm:w-5" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3 sm:space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`group cursor-pointer rounded-lg border p-3 transition-all sm:p-4 ${
                    theme === "dark"
                      ? "border-white/10 bg-white/5 hover:border-[#15803d]/40 hover:bg-[#15803d]/10 hover:shadow-[0_0_20px_rgba(21,128,61,0.1)]"
                      : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h4
                        className={`truncate text-sm font-bold sm:text-base ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {inquiry.company}
                      </h4>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <p
                      className={`mb-1 truncate text-xs sm:text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      {inquiry.contact}
                    </p>
                    <div
                      className={`flex flex-wrap items-center gap-2 text-xs ${
                        theme === "dark" ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`max-w-full truncate rounded px-2 py-1 ${
                          theme === "dark" ? "bg-white/10" : "bg-slate-200"
                        }`}
                      >
                        {inquiry.service}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{inquiry.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card
          className={
            theme === "dark"
              ? "border-white/10 bg-black/40 backdrop-blur-xl"
              : "border-slate-200 bg-white shadow-sm"
          }
        >
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle
              className={`flex items-center gap-2 text-base sm:text-lg ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d] sm:h-5 sm:w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-2 sm:space-y-3">
              <button
                className={`group w-full touch-manipulation rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.02] active:scale-100 sm:p-4 ${
                  theme === "dark"
                    ? "border-[#15803d]/30 bg-[#15803d]/10 hover:border-[#15803d]/50 hover:bg-[#15803d]/20 hover:shadow-[0_0_20px_rgba(21,128,61,0.2)]"
                    : "border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#15803d] to-[#16a34a] transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <UserPlus className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`truncate text-sm font-bold sm:text-base ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Add New Inquiry
                    </h4>
                    <p
                      className={`truncate text-xs sm:text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      Manually add a new inquiry
                    </p>
                  </div>
                </div>
              </button>

              <button
                className={`group w-full touch-manipulation rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.02] active:scale-100 sm:p-4 ${
                  theme === "dark"
                    ? "border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`truncate text-sm font-bold sm:text-base ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Add Lead
                    </h4>
                    <p
                      className={`truncate text-xs sm:text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      Create a new potential lead
                    </p>
                  </div>
                </div>
              </button>

              <button
                className={`group w-full touch-manipulation rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.02] active:scale-100 sm:p-4 ${
                  theme === "dark"
                    ? "border-violet-500/30 bg-violet-500/10 hover:border-violet-500/50 hover:bg-violet-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    : "border-violet-200 bg-violet-50 hover:border-violet-400 hover:bg-violet-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <Users className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`truncate text-sm font-bold sm:text-base ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      View All Clients
                    </h4>
                    <p
                      className={`truncate text-xs sm:text-sm ${
                        theme === "dark" ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      See contracted clients
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
