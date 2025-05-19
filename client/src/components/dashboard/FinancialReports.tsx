import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Download, Plus } from "lucide-react";
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
import { Report } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FinancialReportsProps {
  reports: Report[];
  onGenerateReport: () => void;
  isLoading?: boolean;
}

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

const FinancialReports: React.FC<FinancialReportsProps> = ({ 
  reports, 
  onGenerateReport,
  isLoading = false 
}) => {
  const [open, setOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("financial_statement");
  const { toast } = useToast();

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
      
      onGenerateReport();
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Financial Reports</CardTitle>
        <button className="text-sm text-primary">View All</button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-neutral-400">Loading reports...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                <IconWrapper 
                  variant={getIconVariant(report.iconType)} 
                  size="sm" 
                  className="mr-3"
                >
                  <i className={getReportIcon(report.type)}></i>
                </IconWrapper>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-500">{report.title}</p>
                  <p className="text-xs text-neutral-400">
                    Generated on {formatDate(report.generatedAt.toString())}
                  </p>
                </div>
                <button className="p-2 text-neutral-400 hover:text-primary">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4 border-primary text-primary">
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
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
