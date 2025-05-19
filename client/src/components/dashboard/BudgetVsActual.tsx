import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetItem, Department } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface BudgetVsActualProps {
  budgetItems: BudgetItem[];
  department: Department;
  onDepartmentChange: (department: Department) => void;
  isLoading?: boolean;
}

const BudgetVsActual: React.FC<BudgetVsActualProps> = ({ 
  budgetItems, 
  department, 
  onDepartmentChange, 
  isLoading = false 
}) => {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getBudgetStatus = (actual: number, budgeted: number) => {
    const percentage = (actual / budgeted) * 100;
    const difference = percentage - 100;
    const isOver = difference > 0;
    const statusText = isOver 
      ? `${Math.abs(difference).toFixed(0)}% over budget` 
      : `${Math.abs(difference).toFixed(0)}% under budget`;
    
    const statusColor = isOver ? "text-[#E74C3C]" : "text-[#2ECC71]";
    const barColor = isOver ? "bg-[#E74C3C]" : "bg-[#2ECC71]";
    
    return { 
      percentage, 
      statusText, 
      statusColor, 
      barColor,
      isOver 
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Budget vs Actual</CardTitle>
        <Select
          value={department}
          onValueChange={(value) => onDepartmentChange(value as Department)}
        >
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Departments">All Departments</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="R&D">R&D</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-neutral-400">Loading budget data...</p>
          </div>
        ) : (
          <>
            {budgetItems.map((item) => {
              const { actualAmount, budgetedAmount, category } = item;
              const status = getBudgetStatus(Number(actualAmount), Number(budgetedAmount));
              
              return (
                <div className="mb-4" key={item.id}>
                  <div className="flex justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-neutral-500">{category}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-sm text-neutral-500">{formatAmount(Number(actualAmount))}</span>
                      <span className="text-sm text-neutral-400">/</span>
                      <span className="text-sm text-neutral-400">{formatAmount(Number(budgetedAmount))}</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${status.barColor} h-2 rounded-full`} 
                      style={{ width: `${Math.min(status.percentage, 130)}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs ${status.statusColor}`}>{status.statusText}</span>
                  </div>
                </div>
              );
            })}
            
            <Button variant="outline" className="w-full mt-2">
              View Detailed Budget Report
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetVsActual;
