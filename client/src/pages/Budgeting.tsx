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
            <div className="text-center p-12">
              <p className="text-muted-foreground mb-4">Budget planning interface will be available soon</p>
              <Button>Create Budget Plan</Button>
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
            <div className="text-center p-8">
              <p className="text-muted-foreground">Budget templates coming soon</p>
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
            <div className="text-center p-8">
              <p className="text-muted-foreground">Approval workflow coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Budgeting;
