import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  FilePlus, 
  Plus, 
  Upload, 
  BarChart, 
  Share2, 
  FileText, 
  ChevronRight, 
  FileSpreadsheet,
  FileBarChart,
  FileStack,
  Clock,
  Filter,
  Calendar,
  CheckCircle,
  FilePieChart,
  Search
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

const Reports = () => {
  const [filters, setFilters] = useState({
    period: defaultFilters.period,
    department: defaultFilters.department,
    region: defaultFilters.region
  });
  
  const [open, setOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("financial_statement");
  const { toast } = useToast();
  
  const { data: reports, isLoading, refetch } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      return response.json();
    }
  });
  
  const handleFilterChange = (type: 'period' | 'department' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleSubmit = async () => {
    if (!reportTitle.trim()) {
      toast({
        title: "Error",
        description: "Report title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/reports/generate", {
        title: reportTitle,
        type: reportType
      });
      
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      
      refetch();
      setOpen(false);
      setReportTitle("");
      setReportType("financial_statement");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  
  const getReportIcon = (type: string) => {
    switch (type) {
      case "financial_statement":
        return <FileText className="h-4 w-4" />;
      case "revenue_forecast":
        return <FileBarChart className="h-4 w-4" />;
      case "budget_analysis":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "cash_flow":
        return <FilePieChart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getReportIconColor = (type: string) => {
    switch (type) {
      case "financial_statement":
        return "from-[#2D71A8] to-[#4D8EC3]";
      case "revenue_forecast":
        return "from-green-500 to-green-600";
      case "budget_analysis":
        return "from-amber-500 to-amber-600";
      case "cash_flow":
        return "from-purple-500 to-purple-600";
      default:
        return "from-[#2D71A8] to-[#4D8EC3]";
    }
  };

  // Define stats for the premium header
  const headerStats = [
    {
      title: "Total Reports",
      value: reports ? reports.length.toString() : "0",
      icon: <FileStack className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Recent Reports",
      value: reports ? reports.filter(r => {
        const date = new Date(r.generatedAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        return daysDiff <= 7;
      }).length.toString() : "0",
      icon: <Clock className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Period",
      value: filters.period,
      icon: <Calendar className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Status",
      value: "All Active",
      icon: <CheckCircle className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    }
  ];

  const headerActions = (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Title</label>
              <Input 
                placeholder="Enter report title" 
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_statement">Financial Statement</SelectItem>
                  <SelectItem value="revenue_forecast">Revenue Forecast</SelectItem>
                  <SelectItem value="budget_analysis">Budget Analysis</SelectItem>
                  <SelectItem value="cash_flow">Cash Flow Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A]">Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Upload className="mr-2 h-4 w-4" />
        Import Reports
      </Button>
    </>
  );
  
  return (
    <>
      <PremiumPageHeader
        title="Financial Reports"
        description="Generate, analyze, and share comprehensive financial reports"
        icon={<FileText className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileStack className="h-4 w-4 mr-2" />
            All Reports
          </TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Financial Statements
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileBarChart className="h-4 w-4 mr-2" />
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Budget Analysis
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FilePieChart className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Reports</CardTitle>
                  <CardDescription>
                    View and manage all your financial reports
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search reports..." className="pl-9 pr-4" />
                  </div>
                  <Button variant="outline" size="sm" className="h-9 gap-1 border-[#2D71A8] text-[#2D71A8]">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            }
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse bg-slate-100 h-8 w-48 rounded mx-auto mb-4"></div>
                <div className="animate-pulse bg-slate-100 h-4 w-64 rounded mx-auto"></div>
              </div>
            ) : reports && reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(report => (
                    <TableRow key={report.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-md bg-gradient-to-br ${getReportIconColor(report.type)} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}>
                            {getReportIcon(report.type)}
                          </div>
                          <span className="font-medium">{report.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.type === "financial_statement" ? "Financial Statement" : 
                         report.type === "revenue_forecast" ? "Revenue Forecast" :
                         report.type === "budget_analysis" ? "Budget Analysis" :
                         report.type === "cash_flow" ? "Cash Flow Statement" : report.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(report.generatedAt.toString())}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FilePlus className="mx-auto h-12 w-12 text-[#2D71A8] opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-slate-800">No reports found</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Create your first report by clicking the "Generate New Report" button to get started with financial analysis.
                </p>
                <Button 
                  onClick={() => setOpen(true)}
                  className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Generate New Report
                </Button>
              </div>
            )}
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            title="Financial Statements"
            description="Balance sheets, income statements, and cash flow statements"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse bg-slate-100 h-8 w-48 rounded mx-auto mb-4"></div>
                <div className="animate-pulse bg-slate-100 h-4 w-64 rounded mx-auto"></div>
              </div>
            ) : reports ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.type === "financial_statement")
                    .map(report => (
                      <TableRow key={report.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(report.generatedAt.toString())}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-blue-50 hover:text-[#2D71A8]">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-green-500 to-green-600"
            title="Forecast Reports"
            description="Revenue and expense projections"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse bg-slate-100 h-8 w-48 rounded mx-auto mb-4"></div>
                <div className="animate-pulse bg-slate-100 h-4 w-64 rounded mx-auto"></div>
              </div>
            ) : reports ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.type === "revenue_forecast")
                    .map(report => (
                      <TableRow key={report.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                              <FileBarChart className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(report.generatedAt.toString())}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-green-50 hover:text-green-600">
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-green-50 hover:text-green-600">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-green-50 hover:text-green-600">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-amber-500 to-amber-600"
            title="Budget Analysis"
            description="Budget variance and performance analysis"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse bg-slate-100 h-8 w-48 rounded mx-auto mb-4"></div>
                <div className="animate-pulse bg-slate-100 h-4 w-64 rounded mx-auto"></div>
              </div>
            ) : reports ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.type === "budget_analysis")
                    .map(report => (
                      <TableRow key={report.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                              <FileSpreadsheet className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(report.generatedAt.toString())}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-50 hover:text-amber-600">
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-50 hover:text-amber-600">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-50 hover:text-amber-600">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-purple-500 to-purple-600"
            title="Cash Flow Reports"
            description="Cash flow statements and projections"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse bg-slate-100 h-8 w-48 rounded mx-auto mb-4"></div>
                <div className="animate-pulse bg-slate-100 h-4 w-64 rounded mx-auto"></div>
              </div>
            ) : reports ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter(report => report.type === "cash_flow")
                    .map(report => (
                      <TableRow key={report.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
                              <FilePieChart className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(report.generatedAt.toString())}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-purple-50 hover:text-purple-600">
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-purple-50 hover:text-purple-600">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 hover:bg-purple-50 hover:text-purple-600">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </PremiumCard>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Reports;