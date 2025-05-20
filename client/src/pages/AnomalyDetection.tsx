import React from "react";
import AnomalyDetectionComponent from "@/components/ai/AnomalyDetection";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { 
  AlertTriangle, 
  BarChart, 
  LineChart, 
  RefreshCw, 
  Settings, 
  Download, 
  FileText,
  Search,
  Filter,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const AnomalyDetection = () => {
  // Sample anomaly stats for the premium header
  const headerStats = [
    {
      title: "Detected Anomalies",
      value: "5",
      icon: <AlertTriangle className="h-5 w-5" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      title: "Monitoring Period",
      value: "Last 30 Days",
      icon: <Calendar className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Alert Sensitivity",
      value: "Medium",
      icon: <BarChart className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      title: "Data Sources",
      value: "4 Connected",
      icon: <LineChart className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Settings className="mr-2 h-4 w-4" />
        Configure Alerts
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <RefreshCw className="mr-2 h-4 w-4" />
        Run Detection
      </Button>
    </>
  );

  // Sample anomalies data for demonstration
  const anomalies = [
    {
      id: 1,
      title: "Unexpected Revenue Spike",
      description: "Revenue in Q2 shows an unexpected 28% increase compared to forecasts and historical patterns.",
      type: "variance",
      severity: "high",
      status: "investigating",
      metric: "revenue",
      detectedAt: new Date("2025-05-15T10:23:00"),
      affectedPeriods: ["Q2 2025"],
      impact: {
        description: "Positive impact on overall financial position",
        value: 320000,
        isMonetary: true
      }
    },
    {
      id: 2,
      title: "Marketing Expense Anomaly",
      description: "Marketing expenses increased by 45% in May without corresponding budget allocation or approval.",
      type: "outlier",
      severity: "critical",
      status: "detected",
      metric: "expenses",
      detectedAt: new Date("2025-05-18T08:15:00"),
      affectedPeriods: ["May 2025"],
      impact: {
        description: "Negative impact on marketing ROI",
        value: -85000,
        isMonetary: true
      }
    },
    {
      id: 3,
      title: "Unusual Cash Flow Pattern",
      description: "Cash outflows are occurring 3 days earlier than historical patterns, potentially impacting liquidity.",
      type: "pattern",
      severity: "medium",
      status: "investigating",
      metric: "cashflow",
      detectedAt: new Date("2025-05-17T14:05:00"),
      affectedPeriods: ["Q2 2025"],
      impact: {
        description: "Temporary liquidity pressure",
        value: -120000,
        isMonetary: true
      }
    },
    {
      id: 4,
      title: "Profit Margin Decline",
      description: "Profit margins have decreased by 3.2% across all product lines despite stable or decreased costs.",
      type: "trend",
      severity: "high",
      status: "detected",
      metric: "margin",
      detectedAt: new Date("2025-05-16T09:30:00"),
      affectedPeriods: ["Q2 2025"],
      impact: {
        description: "Significant impact on profitability targets",
        value: -3.2,
        isMonetary: false
      }
    },
    {
      id: 5,
      title: "Inventory Turnover Decrease",
      description: "Inventory turnover ratio has decreased significantly, suggesting potential stocking issues.",
      type: "variance",
      severity: "medium",
      status: "resolved",
      metric: "operation",
      detectedAt: new Date("2025-05-10T11:45:00"),
      affectedPeriods: ["April 2025", "May 2025"],
      impact: {
        description: "Increased inventory carrying costs",
        value: -45000,
        isMonetary: true
      }
    }
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-50 text-red-700">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-50 text-amber-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-50 text-blue-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-100 text-slate-700">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'detected':
        return <Badge className="bg-red-50 text-red-700">Detected</Badge>;
      case 'investigating':
        return <Badge className="bg-amber-50 text-amber-700">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-50 text-green-700">Resolved</Badge>;
      case 'ignored':
        return <Badge className="bg-slate-100 text-slate-700">Ignored</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">Unknown</Badge>;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatImpact = (impact) => {
    if (impact.isMonetary) {
      return impact.value >= 0 
        ? `+$${Math.abs(impact.value).toLocaleString()}` 
        : `-$${Math.abs(impact.value).toLocaleString()}`;
    } else {
      return impact.value >= 0
        ? `+${impact.value}%`
        : `${impact.value}%`;
    }
  };

  return (
    <>
      <PremiumPageHeader
        title="AI Anomaly Detection"
        description="Automatically detect unusual patterns and anomalies in your financial data"
        icon={<AlertTriangle className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            All Anomalies
          </TabsTrigger>
          <TabsTrigger value="critical" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <LineChart className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <BarChart className="h-4 w-4 mr-2" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Time Period</div>
              <Select defaultValue="last-30-days">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Severity</div>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Status</div>
              <Select defaultValue="all">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="detected">Detected</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search anomalies..." className="pl-9 pr-4" />
            </div>
            <Button variant="outline" size="sm" className="ml-2 border-[#2D71A8] text-[#2D71A8]">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <PremiumCard
                key={anomaly.id}
                className="hover-lift overflow-hidden"
                showAccent={true}
                accentColor={
                  anomaly.severity === 'critical' ? 'from-red-500 to-red-600' :
                  anomaly.severity === 'high' ? 'from-amber-500 to-amber-600' :
                  anomaly.severity === 'medium' ? 'from-blue-500 to-blue-600' :
                  'from-slate-400 to-slate-500'
                }
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                        anomaly.severity === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        anomaly.severity === 'high' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                        anomaly.severity === 'medium' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-slate-500 to-slate-600'
                      } shadow-md`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{anomaly.title}</h3>
                        <p className="text-slate-600 mb-3">{anomaly.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {getSeverityBadge(anomaly.severity)}
                          {getStatusBadge(anomaly.status)}
                          <Badge className="bg-slate-100 text-slate-700">{anomaly.type}</Badge>
                          <Badge className="bg-slate-100 text-slate-700">{anomaly.metric}</Badge>
                          {anomaly.affectedPeriods.map((period, idx) => (
                            <Badge key={idx} className="bg-blue-50 text-blue-700">{period}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm text-slate-500">Detected:</div>
                        <div className="text-sm font-medium">{formatDate(anomaly.detectedAt)}</div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm text-slate-500">Impact:</div>
                        <div className={`text-sm font-medium ${
                          anomaly.impact.value >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatImpact(anomaly.impact)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          {anomaly.status !== 'resolved' ? 'Resolve' : 'Reopen'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="critical" className="mt-0">
          <div className="space-y-4">
            {anomalies
              .filter(a => a.severity === 'critical')
              .map((anomaly) => (
                <PremiumCard
                  key={anomaly.id}
                  className="hover-lift overflow-hidden"
                  showAccent={true}
                  accentColor="from-red-500 to-red-600"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{anomaly.title}</h3>
                          <p className="text-slate-600 mb-3">{anomaly.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {getSeverityBadge(anomaly.severity)}
                            {getStatusBadge(anomaly.status)}
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.type}</Badge>
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.metric}</Badge>
                            {anomaly.affectedPeriods.map((period, idx) => (
                              <Badge key={idx} className="bg-blue-50 text-blue-700">{period}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Detected:</div>
                          <div className="text-sm font-medium">{formatDate(anomaly.detectedAt)}</div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Impact:</div>
                          <div className={`text-sm font-medium ${
                            anomaly.impact.value >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatImpact(anomaly.impact)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            {anomaly.status !== 'resolved' ? 'Resolve' : 'Reopen'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-0">
          <div className="space-y-4">
            {anomalies
              .filter(a => a.metric === 'revenue')
              .map((anomaly) => (
                <PremiumCard
                  key={anomaly.id}
                  className="hover-lift overflow-hidden"
                  showAccent={true}
                  accentColor={
                    anomaly.severity === 'critical' ? 'from-red-500 to-red-600' :
                    anomaly.severity === 'high' ? 'from-amber-500 to-amber-600' :
                    anomaly.severity === 'medium' ? 'from-blue-500 to-blue-600' :
                    'from-slate-400 to-slate-500'
                  }
                >
                  {/* Same content structure as above */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                          anomaly.severity === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          anomaly.severity === 'high' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                          anomaly.severity === 'medium' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        } shadow-md`}>
                          <LineChart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{anomaly.title}</h3>
                          <p className="text-slate-600 mb-3">{anomaly.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {getSeverityBadge(anomaly.severity)}
                            {getStatusBadge(anomaly.status)}
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.type}</Badge>
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.metric}</Badge>
                            {anomaly.affectedPeriods.map((period, idx) => (
                              <Badge key={idx} className="bg-blue-50 text-blue-700">{period}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Detected:</div>
                          <div className="text-sm font-medium">{formatDate(anomaly.detectedAt)}</div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Impact:</div>
                          <div className={`text-sm font-medium ${
                            anomaly.impact.value >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatImpact(anomaly.impact)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            {anomaly.status !== 'resolved' ? 'Resolve' : 'Reopen'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-0">
          <div className="space-y-4">
            {anomalies
              .filter(a => a.metric === 'expenses')
              .map((anomaly) => (
                <PremiumCard
                  key={anomaly.id}
                  className="hover-lift overflow-hidden"
                  showAccent={true}
                  accentColor={
                    anomaly.severity === 'critical' ? 'from-red-500 to-red-600' :
                    anomaly.severity === 'high' ? 'from-amber-500 to-amber-600' :
                    anomaly.severity === 'medium' ? 'from-blue-500 to-blue-600' :
                    'from-slate-400 to-slate-500'
                  }
                >
                  {/* Same content structure as above */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                          anomaly.severity === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          anomaly.severity === 'high' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                          anomaly.severity === 'medium' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          'bg-gradient-to-br from-slate-500 to-slate-600'
                        } shadow-md`}>
                          <BarChart className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{anomaly.title}</h3>
                          <p className="text-slate-600 mb-3">{anomaly.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {getSeverityBadge(anomaly.severity)}
                            {getStatusBadge(anomaly.status)}
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.type}</Badge>
                            <Badge className="bg-slate-100 text-slate-700">{anomaly.metric}</Badge>
                            {anomaly.affectedPeriods.map((period, idx) => (
                              <Badge key={idx} className="bg-blue-50 text-blue-700">{period}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Detected:</div>
                          <div className="text-sm font-medium">{formatDate(anomaly.detectedAt)}</div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm text-slate-500">Impact:</div>
                          <div className={`text-sm font-medium ${
                            anomaly.impact.value >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatImpact(anomaly.impact)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            {anomaly.status !== 'resolved' ? 'Resolve' : 'Reopen'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Anomaly Detection Settings</h3>
                  <p className="text-sm text-slate-500">Configure detection parameters and notification preferences</p>
                </div>
              </div>
            }
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="font-medium text-lg border-b pb-2">Detection Parameters</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Alert Sensitivity</div>
                      <div className="text-sm text-slate-500">How sensitive anomaly detection should be</div>
                    </div>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Deviation Threshold</div>
                      <div className="text-sm text-slate-500">Minimum deviation to trigger alert</div>
                    </div>
                    <Select defaultValue="15">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Historical Window</div>
                      <div className="text-sm text-slate-500">Period to use for baseline comparison</div>
                    </div>
                    <Select defaultValue="12-months">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="12-months">12 Months</SelectItem>
                        <SelectItem value="24-months">24 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Anomaly Types</div>
                      <div className="text-sm text-slate-500">Types of anomalies to detect</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                      Configure Types
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-medium text-lg border-b pb-2">Notification Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-slate-500">Receive alerts via email</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-slate-500">Receive alerts in-app</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Critical Alerts Only</div>
                      <div className="text-sm text-slate-500">Only notify for critical anomalies</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-slate-200">
                      <span className="absolute h-3 w-3 translate-x-1 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Alert Recipients</div>
                      <div className="text-sm text-slate-500">Who receives alerts</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                      Manage Recipients
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 flex justify-end">
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                Save Settings
              </Button>
            </div>
          </PremiumCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumCard
              className="hover-lift"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
                <div>
                  <h3 className="text-lg font-semibold">Detection Metrics</h3>
                  <p className="text-sm text-slate-500">Metrics being monitored for anomalies</p>
                </div>
              }
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Revenue</div>
                    <div className="text-sm text-slate-500">Daily and monthly revenue trends</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Expenses</div>
                    <div className="text-sm text-slate-500">All expense categories</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Cash Flow</div>
                    <div className="text-sm text-slate-500">Inflows and outflows</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Profit Margins</div>
                    <div className="text-sm text-slate-500">Gross and net margins</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Operational Metrics</div>
                    <div className="text-sm text-slate-500">Inventory, turnover, etc.</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard
              className="hover-lift"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
                <div>
                  <h3 className="text-lg font-semibold">Schedule</h3>
                  <p className="text-sm text-slate-500">Anomaly detection schedule</p>
                </div>
              }
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Automatic Detection</div>
                    <div className="text-sm text-slate-500">Run detection automatically</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Schedule Frequency</div>
                    <div className="text-sm text-slate-500">How often to run detection</div>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">Run Time</div>
                    <div className="text-sm text-slate-500">When to run detection</div>
                  </div>
                  <Select defaultValue="6-am">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-am">12:00 AM</SelectItem>
                      <SelectItem value="6-am">6:00 AM</SelectItem>
                      <SelectItem value="12-pm">12:00 PM</SelectItem>
                      <SelectItem value="6-pm">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between items-center p-2 rounded-lg border hover:bg-slate-50">
                  <div>
                    <div className="font-medium">On-Change Detection</div>
                    <div className="text-sm text-slate-500">Detect when data changes</div>
                  </div>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                    <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Detection Now
                </Button>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Original component, we'll hide this for now */}
      <div className="hidden">
        <AnomalyDetectionComponent />
      </div>
    </>
  );
};

export default AnomalyDetection;