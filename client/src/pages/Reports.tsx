import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Download, FilePlus, Plus, Upload, BarChart4, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Report } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";

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
  
  const getReportIcon = (type: string): string => {
    switch (type) {
      case "financial_statement":
        return "ri-file-text-line";
      case "revenue_forecast":
        return "ri-file-chart-line";
      case "budget_analysis":
        return "ri-file-list-3-line";
      case "cash_flow":
        return "ri-file-paper-line";
      default:
        return "ri-file-text-line";
    }
  };
  
  const getIconVariant = (iconType: string) => {
    switch (iconType) {
      case "primary":
        return "primary";
      case "secondary":
        return "secondary";
      case "accent":
        return "accent";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };
  
  return (
    <>
      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-500">Financial Reports</h2>
        
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
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
                <Button onClick={handleSubmit}>Generate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Statements</TabsTrigger>
          <TabsTrigger value="forecast">Forecasts</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>
                View and manage all your financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Loading reports...</p>
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
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <IconWrapper variant={getIconVariant(report.iconType)} size="sm">
                              <i className={getReportIcon(report.type)}></i>
                            </IconWrapper>
                            <span className="font-medium">{report.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.type === "financial_statement" ? "Financial Statement" : 
                           report.type === "revenue_forecast" ? "Revenue Forecast" :
                           report.type === "budget_analysis" ? "Budget Analysis" :
                           report.type === "cash_flow" ? "Cash Flow Statement" : report.type}
                        </TableCell>
                        <TableCell>{formatDate(report.generatedAt.toString())}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <BarChart4 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
                  <FilePlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports found</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first report by clicking the "Generate New Report" button.
                  </p>
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate New Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Statements</CardTitle>
              <CardDescription>
                Balance sheets, income statements, and cash flow statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Loading reports...</p>
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
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconWrapper variant={getIconVariant(report.iconType)} size="sm">
                                <i className={getReportIcon(report.type)}></i>
                              </IconWrapper>
                              <span className="font-medium">{report.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.generatedAt.toString())}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <BarChart4 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Reports</CardTitle>
              <CardDescription>
                Revenue and expense projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Loading reports...</p>
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
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconWrapper variant={getIconVariant(report.iconType)} size="sm">
                                <i className={getReportIcon(report.type)}></i>
                              </IconWrapper>
                              <span className="font-medium">{report.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.generatedAt.toString())}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <BarChart4 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
              <CardDescription>
                Budget variance and performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Loading reports...</p>
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
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconWrapper variant={getIconVariant(report.iconType)} size="sm">
                                <i className={getReportIcon(report.type)}></i>
                              </IconWrapper>
                              <span className="font-medium">{report.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.generatedAt.toString())}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <BarChart4 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Reports</CardTitle>
              <CardDescription>
                Cash flow statements and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Loading reports...</p>
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
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <IconWrapper variant={getIconVariant(report.iconType)} size="sm">
                                <i className={getReportIcon(report.type)}></i>
                              </IconWrapper>
                              <span className="font-medium">{report.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(report.generatedAt.toString())}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <BarChart4 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Reports;
