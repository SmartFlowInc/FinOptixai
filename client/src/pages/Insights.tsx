import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightsPanel from "@/components/insights/InsightsPanel";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";
import { Download, FileUp, RefreshCw, Bell, CheckCircle2, AlertTriangle } from "lucide-react";

const Insights = () => {
  const [filters, setFilters] = useState({
    period: defaultFilters.period,
    department: defaultFilters.department,
    region: defaultFilters.region
  });

  const [insightsPanelExpanded, setInsightsPanelExpanded] = useState<boolean>(true);
  const { toast } = useToast();

  const handleFilterChange = (type: 'period' | 'department' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
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
        <div>
          <h2 className="text-xl font-semibold text-neutral-500">Financial Insights</h2>
          <p className="text-neutral-400 text-sm mt-1">
            AI-powered insights and notifications based on your financial data
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Notification Settings
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Insights
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <InsightsPanel 
            isExpanded={true}
            onToggleExpand={() => {}}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insight Summary</CardTitle>
              <CardDescription>Overview of current insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Critical</div>
                    <div className="text-xs text-neutral-500">Require immediate attention</div>
                  </div>
                </div>
                <div className="text-xl font-medium">1</div>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Warnings</div>
                    <div className="text-xs text-neutral-500">May need attention</div>
                  </div>
                </div>
                <div className="text-xl font-medium">3</div>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Informational</div>
                    <div className="text-xs text-neutral-500">For your awareness</div>
                  </div>
                </div>
                <div className="text-xl font-medium">2</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Success</div>
                    <div className="text-xs text-neutral-500">Positive developments</div>
                  </div>
                </div>
                <div className="text-xl font-medium">2</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insight Actions</CardTitle>
              <CardDescription>Recently handled insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Issue Resolved</span>
                    </div>
                    <span className="text-xs text-neutral-500">2 hours ago</span>
                  </div>
                  <p className="text-sm mt-1">Marketing expenses budget variance addressed and adjusted</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Action In Progress</span>
                    </div>
                    <span className="text-xs text-neutral-500">1 day ago</span>
                  </div>
                  <p className="text-sm mt-1">Cash conversion cycle improvement plan initiated</p>
                </div>
                
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileUp className="h-4 w-4 text-neutral-600" />
                      <span className="text-sm font-medium">Report Generated</span>
                    </div>
                    <span className="text-xs text-neutral-500">3 days ago</span>
                  </div>
                  <p className="text-sm mt-1">Profit margin trend analysis report created</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Actions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Insight Configuration</CardTitle>
          <CardDescription>Customize which insights are generated and how they're delivered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Insight Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Variances
                  </label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-neutral-200">
                    <div className="absolute h-3 w-3 rounded-full bg-white left-[2px]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    Trends
                  </label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary">
                    <div className="absolute h-3 w-3 rounded-full bg-white right-[2px]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-500" />
                    Forecasts
                  </label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary">
                    <div className="absolute h-3 w-3 rounded-full bg-white right-[2px]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Threshold Configuration</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm w-32">Revenue</div>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="text-sm w-8 text-right">±10%</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm w-32">Expenses</div>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-sm w-8 text-right">±15%</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm w-32">Profit Margin</div>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="text-sm w-8 text-right">±5%</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Notification Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Email Digest</label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary">
                    <div className="absolute h-3 w-3 rounded-full bg-white right-[2px]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">In-App Notifications</label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-primary">
                    <div className="absolute h-3 w-3 rounded-full bg-white right-[2px]"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Slack Notifications</label>
                  <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-neutral-200">
                    <div className="absolute h-3 w-3 rounded-full bg-white left-[2px]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Insights;