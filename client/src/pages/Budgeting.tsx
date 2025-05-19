import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import { useQuery } from "@tanstack/react-query";
import { BudgetItem, Department } from "@shared/schema";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";

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

  return (
    <>
      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Budget Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              Analyze your budget allocation and spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Budget Period: {filters.period}</div>
                <Button>
                  Create Budget Plan
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-y">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Category</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Allocated</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Actual</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Variance</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {/* Personnel row */}
                      <tr className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">Personnel</div>
                          <div className="text-sm text-neutral-500">Salaries, benefits, bonuses</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">$230,000</td>
                        <td className="py-3 px-4 text-right font-medium">$245,000</td>
                        <td className="py-3 px-4 text-right font-medium text-red-600">
                          <span className="flex items-center justify-end">
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
                      <tr className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">Software</div>
                          <div className="text-sm text-neutral-500">Licenses, subscriptions</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">$50,000</td>
                        <td className="py-3 px-4 text-right font-medium">$42,000</td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          <span className="flex items-center justify-end">
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
                      <tr className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">Travel</div>
                          <div className="text-sm text-neutral-500">Business trips, conferences</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">$25,000</td>
                        <td className="py-3 px-4 text-right font-medium">$18,000</td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          <span className="flex items-center justify-end">
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
                      <tr className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">Marketing</div>
                          <div className="text-sm text-neutral-500">Campaigns, events, materials</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">$90,000</td>
                        <td className="py-3 px-4 text-right font-medium">$105,000</td>
                        <td className="py-3 px-4 text-right font-medium text-red-600">
                          <span className="flex items-center justify-end">
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
                      <tr className="bg-neutral-50 font-medium">
                        <td className="py-3 px-4">Total</td>
                        <td className="py-3 px-4 text-right">$395,000</td>
                        <td className="py-3 px-4 text-right">$410,000</td>
                        <td className="py-3 px-4 text-right text-red-600">+$15,000</td>
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
                    <div className="text-xs text-neutral-500 mb-1">Personnel</div>
                    <div className="text-lg font-medium">58.2%</div>
                  </div>
                  <div className="rounded-lg p-3 bg-green-50 border border-green-100">
                    <div className="text-xs text-neutral-500 mb-1">Software</div>
                    <div className="text-lg font-medium">12.7%</div>
                  </div>
                  <div className="rounded-lg p-3 bg-amber-50 border border-amber-100">
                    <div className="text-xs text-neutral-500 mb-1">Travel</div>
                    <div className="text-lg font-medium">6.3%</div>
                  </div>
                  <div className="rounded-lg p-3 bg-purple-50 border border-purple-100">
                    <div className="text-xs text-neutral-500 mb-1">Marketing</div>
                    <div className="text-lg font-medium">22.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
      
      {/* Additional Budget Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Templates</CardTitle>
            <CardDescription>
              Predefined budget templates for various departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-lg p-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sales Department</div>
                    <div className="text-sm text-neutral-500">Standard sales budget with commission structure</div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Department</div>
                    <div className="text-sm text-neutral-500">Campaign-focused marketing budget template</div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">IT Department</div>
                    <div className="text-sm text-neutral-500">Technology infrastructure and support budget</div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Human Resources</div>
                    <div className="text-sm text-neutral-500">Personnel and training budget structure</div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Operations</div>
                    <div className="text-sm text-neutral-500">Operational costs and logistics budget</div>
                  </div>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" className="w-full">
                  <span className="mr-2">+</span> Create Custom Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Approval Workflow</CardTitle>
            <CardDescription>
              Streamline your budget approval process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Current Approvals</div>
                <Button variant="outline" size="sm">
                  <span className="mr-2">+</span> New Request
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Pending approval item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-amber-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          1
                        </div>
                        <div>
                          <div className="font-medium">Q4 Marketing Budget</div>
                          <div className="text-sm text-neutral-500">Pending approval - Requested 2 days ago</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-neutral-500">Requested by:</span> Alicia Kim (Marketing Director)
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8">Reject</Button>
                      <Button size="sm" className="h-8">Approve</Button>
                    </div>
                  </div>
                </div>
                
                {/* Approved item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          2
                        </div>
                        <div>
                          <div className="font-medium">IT Infrastructure Budget</div>
                          <div className="text-sm text-neutral-500">Approved on Oct 15, 2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-neutral-500">Approved by:</span> John Doe (Financial Director)
                    </div>
                    <Button variant="outline" size="sm" className="h-8">View Details</Button>
                  </div>
                </div>
                
                {/* Rejected item */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-3 border-b bg-red-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          3
                        </div>
                        <div>
                          <div className="font-medium">Executive Travel Budget Increase</div>
                          <div className="text-sm text-neutral-500">Rejected on Oct 12, 2023</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Rejected
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-neutral-500">Reason:</span> Exceeds fiscal year allocation
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Resubmit</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="text-sm font-medium mb-2">Approval Process</div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <div className="h-0.5 w-8 bg-neutral-200"></div>
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <div className="h-0.5 w-8 bg-neutral-200"></div>
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <div className="h-0.5 w-8 bg-neutral-200"></div>
                  <div className="h-8 w-8 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </div>
                </div>
                <div className="flex text-xs text-neutral-500 mt-2">
                  <div className="w-8 text-center">Submit</div>
                  <div className="w-8"></div>
                  <div className="w-8 text-center">Review</div>
                  <div className="w-8"></div>
                  <div className="w-8 text-center">Approve</div>
                  <div className="w-8"></div>
                  <div className="w-8 text-center">Finalize</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Budgeting;
