import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import { useQuery } from "@tanstack/react-query";
import { BudgetItem, Department } from "@shared/schema";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import {
  BarChart,
  DollarSign,
  Calendar,
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertTriangle,
  Check,
  Plus,
  Flag,
  ChevronRight
} from "lucide-react";

const Budgeting = () => {
  const [filters, setFilters] = useState({
    period: defaultFilters.period,
    department: defaultFilters.department,
    region: defaultFilters.region
  });
  
  const { data: budgetItems, isLoading } = useQuery<BudgetItem[]>({
    queryKey: ["/api/budget", filters.period, filters.department],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        period: filters.period,
        department: filters.department
      });
      
      const response = await fetch(`/api/budget?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch budget data');
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

  // Define stats for the premium header
  const headerStats = [
    {
      title: "Total Budget",
      value: "$395,000",
      icon: <DollarSign className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Actual Spend",
      value: "$410,000",
      icon: <Wallet className="h-5 w-5" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      title: "Variance",
      value: "+$15,000",
      icon: <TrendingUp className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      title: "Percent Over",
      value: "3.8%",
      icon: <BarChart className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Calendar className="mr-2 h-4 w-4" />
        Budget History
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        Create Budget Plan
      </Button>
    </>
  );

  return (
    <>
      <PremiumPageHeader
        title="Budgeting"
        description="Manage and optimize your departmental budgets"
        icon={<Wallet className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Check className="h-4 w-4 mr-2" />
            Approvals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Budget Overview */}
            <PremiumCard 
              className="lg:col-span-2 hover-lift" 
              showAccent={true} 
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              title="Budget Overview"
              description="Analyze your budget allocation and spending patterns"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Budget Period: {filters.period}</div>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Allocated</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actual</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Variance</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {/* Personnel row */}
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">Personnel</div>
                            <div className="text-sm text-slate-500">Salaries, benefits, bonuses</div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">$230,000</td>
                          <td className="py-3 px-4 text-right font-medium">$245,000</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">
                            <span className="flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+$15,000</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Over Budget
                            </span>
                          </td>
                        </tr>
                        
                        {/* Software row */}
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">Software</div>
                            <div className="text-sm text-slate-500">Licenses, subscriptions</div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">$50,000</td>
                          <td className="py-3 px-4 text-right font-medium">$42,000</td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            <span className="flex items-center justify-end">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              <span>-$8,000</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Under Budget
                            </span>
                          </td>
                        </tr>
                        
                        {/* Travel row */}
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">Travel</div>
                            <div className="text-sm text-slate-500">Business trips, conferences</div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">$25,000</td>
                          <td className="py-3 px-4 text-right font-medium">$18,000</td>
                          <td className="py-3 px-4 text-right font-medium text-green-600">
                            <span className="flex items-center justify-end">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              <span>-$7,000</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Under Budget
                            </span>
                          </td>
                        </tr>
                        
                        {/* Marketing row */}
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">Marketing</div>
                            <div className="text-sm text-slate-500">Campaigns, events, materials</div>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">$90,000</td>
                          <td className="py-3 px-4 text-right font-medium">$105,000</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">
                            <span className="flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+$15,000</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Over Budget
                            </span>
                          </td>
                        </tr>
                        
                        {/* Total row */}
                        <tr className="bg-slate-50 font-medium">
                          <td className="py-3 px-4">Total</td>
                          <td className="py-3 px-4 text-right">$395,000</td>
                          <td className="py-3 px-4 text-right">$410,000</td>
                          <td className="py-3 px-4 text-right text-red-600">
                            <span className="flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span>+$15,000</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              3.8% Over
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Budget Allocation</div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-lg p-3 bg-blue-50 border border-blue-100">
                      <div className="text-xs text-slate-500 mb-1">Personnel</div>
                      <div className="text-lg font-medium">58.2%</div>
                    </div>
                    <div className="rounded-lg p-3 bg-green-50 border border-green-100">
                      <div className="text-xs text-slate-500 mb-1">Software</div>
                      <div className="text-lg font-medium">12.7%</div>
                    </div>
                    <div className="rounded-lg p-3 bg-amber-50 border border-amber-100">
                      <div className="text-xs text-slate-500 mb-1">Travel</div>
                      <div className="text-lg font-medium">6.3%</div>
                    </div>
                    <div className="rounded-lg p-3 bg-purple-50 border border-purple-100">
                      <div className="text-xs text-slate-500 mb-1">Marketing</div>
                      <div className="text-lg font-medium">22.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumCard>
            
            {/* Budget vs Actual */}
            <div>
              <BudgetVsActual 
                budgetItems={budgetItems || []}
                department={filters.department as Department}
                onDepartmentChange={(dept) => handleFilterChange('department', dept)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            title="Budget Templates"
            description="Predefined budget templates for various departments"
          >
            <div className="space-y-3">
              <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Sales Department</div>
                      <div className="text-sm text-slate-500">Standard sales budget with commission structure</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <BarChart className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Marketing Department</div>
                      <div className="text-sm text-slate-500">Campaign-focused marketing budget template</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">IT Department</div>
                      <div className="text-sm text-slate-500">Technology infrastructure and support budget</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Human Resources</div>
                      <div className="text-sm text-slate-500">Personnel and training budget structure</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Operations</div>
                      <div className="text-sm text-slate-500">Operational costs and logistics budget</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Template
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="approvals" className="mt-4">
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            title="Budget Approval Workflow"
            description="Streamline your budget approval process"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Current Approvals</div>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Pending approval item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-amber-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          <Flag className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Q4 Marketing Budget</div>
                          <div className="text-sm text-slate-500">Pending approval - Requested 2 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">Requested by:</span> Alicia Kim (Marketing Director)
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-red-500 text-red-500 hover:bg-red-50">Reject</Button>
                      <Button size="sm" className="h-8 bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">Approve</Button>
                    </div>
                  </div>
                </div>
                
                {/* Approved item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">IT Infrastructure Budget</div>
                          <div className="text-sm text-slate-500">Approved - 3 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                          Approved
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">Requested by:</span> David Chen (IT Director)
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Rejected item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-red-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Expansion Project Budget</div>
                          <div className="text-sm text-slate-500">Rejected - 1 week ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50">
                          Rejected
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">Requested by:</span> Sarah Johnson (Operations Manager)
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50">Resubmit</Button>
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Budgeting;