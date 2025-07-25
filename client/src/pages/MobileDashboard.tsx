import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import MobileMetrics from '@/components/mobile/MobileMetrics';
import MobileNavigation from '@/components/mobile/MobileNavigation';
import NotificationCenter from '@/components/mobile/NotificationCenter';
import NotificationSettings from '@/components/mobile/NotificationSettings';
import { useNotifications } from '@/hooks/use-notifications';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Menu,
  PieChart,
  Search,
  Settings,
  Sliders,
  User
} from 'lucide-react';
import { formatCurrency } from '@/data/finance';
import { useIsMobile } from '@/hooks/use-mobile';
import { Period, Department, Region } from '@shared/schema';

const MobileDashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Q2_2024');
  const [department, setDepartment] = useState<Department | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('overview');
  const { isSupported: notificationsSupported } = useNotifications();
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Force mobile view for this page
  useEffect(() => {
    // Add a class to force mobile view for testing
    document.documentElement.classList.add('force-mobile-view');
    
    // Clean up
    return () => {
      document.documentElement.classList.remove('force-mobile-view');
    };
  }, []);
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['/api/dashboard', { period, department, region }],
  });
  
  // Handle period change
  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };
  
  // Format period for display
  const formatPeriod = (period: Period): string => {
    switch (period) {
      case 'Q1_2023':
        return 'Q1 2023';
      case 'Q2_2023':
        return 'Q2 2023';
      case 'Q3_2023':
        return 'Q3 2023';
      case 'Q4_2023':
        return 'Q4 2023';
      case 'Q1_2024':
        return 'Q1 2024';
      case 'Q2_2024':
        return 'Q2 2024';
      case 'Q3_2024':
        return 'Q3 2024';
      case 'Q4_2024':
        return 'Q4 2024';
      default:
        return 'Current Quarter';
    }
  };
  
  return (
    <div className="pb-20">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="mr-3 rounded-lg bg-primary p-1.5">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">FinOptix</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            
            <button>
              <User className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Filter Bar */}
        <div className="px-4 py-2 bg-muted/30 flex items-center justify-between">
          <Select value={period} onValueChange={(value) => handlePeriodChange(value as Period)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1_2024">Q1 2024</SelectItem>
              <SelectItem value="Q2_2024">Q2 2024</SelectItem>
              <SelectItem value="Q3_2024">Q3 2024</SelectItem>
              <SelectItem value="Q4_2024">Q4 2024</SelectItem>
              <SelectItem value="Q4_2023">Q4 2023</SelectItem>
            </SelectContent>
          </Select>
          
          <button>
            <Sliders className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {/* Main Content with top padding for header */}
      <div className="pt-28 px-4 space-y-6">
        {/* Metrics */}
        <MobileMetrics 
          periodFilter={formatPeriod(period)}
          onRefresh={() => refetch()}
        />
        
        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Revenue Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription>
                  YTD performance vs target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency('1,350,000')}
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1 mb-2">
                    <span className="text-muted-foreground">Target: {formatCurrency('1,250,000')}</span>
                    <span className="font-medium text-green-600">+4.5%</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
                </div>
                
                <div className="mt-4 space-y-2">
                  {/* Product Revenue */}
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span>Product Revenue</span>
                    <span className="font-medium">{formatCurrency('650000')}</span>
                  </div>
                  
                  {/* Service Revenue */}
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span>Service Revenue</span>
                    <span className="font-medium">{formatCurrency('420000')}</span>
                  </div>
                  
                  {/* Subscription Revenue */}
                  <div className="flex justify-between text-sm">
                    <span>Subscription Revenue</span>
                    <span className="font-medium">{formatCurrency('280000')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Items */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Action Items</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-md bg-blue-50">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-md mr-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Review Q3 Marketing Budget</p>
                        <p className="text-xs text-muted-foreground">Due in 2 days</p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 text-xs">Review</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-md bg-amber-50">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-1 rounded-md mr-2">
                        <DollarSign className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Approve Sales Team Expenses</p>
                        <p className="text-xs text-muted-foreground">Due tomorrow</p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8 text-xs">Approve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cashflow" className="mt-4 space-y-4">
            {/* Cash Flow Forecast */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cash Flow Forecast</CardTitle>
                <CardDescription>
                  Next 90 days projection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[150px] w-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Cash flow chart goes here</p>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Inflow</div>
                    <div className="font-medium text-sm text-green-600">{formatCurrency('346000')}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground">Outflow</div>
                    <div className="font-medium text-sm text-red-600">{formatCurrency('284000')}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground">Net</div>
                    <div className="font-medium text-sm text-blue-600">{formatCurrency('62000')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Cash Position */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cash Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Operating Account</span>
                      <span className="text-sm font-medium">{formatCurrency('235000')}</span>
                    </div>
                    <Progress value={60} className="h-1.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Savings Account</span>
                      <span className="text-sm font-medium">{formatCurrency('450000')}</span>
                    </div>
                    <Progress value={75} className="h-1.5" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Investment Account</span>
                      <span className="text-sm font-medium">{formatCurrency('820000')}</span>
                    </div>
                    <Progress value={90} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budget" className="mt-4 space-y-4">
            {/* Budget Performance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Budget Performance</CardTitle>
                <CardDescription>
                  Actual vs Budget for {formatPeriod(period)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 space-y-4">
                  {/* Marketing */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Marketing</span>
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">85%</Badge>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency('42500')} / {formatCurrency('50000')}</span>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>
                  
                  {/* R&D */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">R&D</span>
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">105%</Badge>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency('105000')} / {formatCurrency('100000')}</span>
                    </div>
                    <Progress value={105} className="h-1.5" />
                  </div>
                  
                  {/* Operations */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Operations</span>
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">68%</Badge>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency('136000')} / {formatCurrency('200000')}</span>
                    </div>
                    <Progress value={68} className="h-1.5" />
                  </div>
                  
                  {/* Sales */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">Sales</span>
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">72%</Badge>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency('72000')} / {formatCurrency('100000')}</span>
                    </div>
                    <Progress value={72} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Budget Adjustments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Budget Adjustments</CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-2">
                  {/* R&D Over Budget Alert */}
                  <div className="flex items-center justify-between p-2 rounded-md bg-red-50">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-1 rounded-md mr-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">R&D Over Budget</p>
                        <p className="text-xs text-muted-foreground">5% over allocated budget</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 text-xs">Adjust</Button>
                  </div>
                  
                  {/* Budget Transfer Recommendation */}
                  <div className="flex items-center justify-between p-2 rounded-md bg-blue-50">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-md mr-2">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Transfer from Operations to R&D</p>
                        <p className="text-xs text-muted-foreground">Recommended: {formatCurrency('10000')}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 text-xs">Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4 space-y-6">
            <NotificationCenter />
            
            <Tabs defaultValue="settings" className="mt-6">
              <TabsList className="w-full">
                <TabsTrigger value="settings">Notification Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="settings" className="mt-4">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default MobileDashboard;