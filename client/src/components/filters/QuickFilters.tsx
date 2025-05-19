import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Period, Department, Region } from "@shared/schema";

interface QuickFiltersProps {
  period: Period;
  department: Department;
  region: Region;
  onFilterChange: (type: 'period' | 'department' | 'region', value: string) => void;
  onExport?: () => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  period,
  department,
  region,
  onFilterChange,
  onExport
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-sm font-medium text-neutral-500">Quick filters:</span>
      
      <Select 
        value={period}
        onValueChange={(value) => onFilterChange('period', value)}
      >
        <SelectTrigger className="w-32 h-9 text-sm">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Q1_2023">Q1 2023</SelectItem>
          <SelectItem value="Q2_2023">Q2 2023</SelectItem>
          <SelectItem value="Q3_2023">Q3 2023</SelectItem>
          <SelectItem value="Q4_2023">Q4 2023</SelectItem>
        </SelectContent>
      </Select>
      
      <Select 
        value={department}
        onValueChange={(value) => onFilterChange('department', value as Department)}
      >
        <SelectTrigger className="w-36 h-9 text-sm">
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
      
      <Select 
        value={region}
        onValueChange={(value) => onFilterChange('region', value as Region)}
      >
        <SelectTrigger className="w-36 h-9 text-sm">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Regions">All Regions</SelectItem>
          <SelectItem value="North America">North America</SelectItem>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
          <SelectItem value="Latin America">Latin America</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        className="ml-auto"
        onClick={onExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};

export default QuickFilters;
