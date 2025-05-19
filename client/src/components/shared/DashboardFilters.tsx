import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FilterX, 
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  Building,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  useFilters, 
  getAvailablePeriods, 
  getAvailableDepartments, 
  getAvailableRegions 
} from '@/contexts/FilterContext';
import { Period, Department, Region } from '@shared/schema';

export interface DashboardFiltersProps {
  className?: string;
  showReset?: boolean;
  showDepartment?: boolean;
  showRegion?: boolean;
  compact?: boolean;
  onChange?: (filters: { period: Period; department?: Department; region?: Region }) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  className,
  showReset = true,
  showDepartment = true,
  showRegion = true,
  compact = false,
  onChange
}) => {
  const { 
    period, 
    department, 
    region, 
    setPeriod, 
    setDepartment, 
    setRegion, 
    resetFilters, 
    isFiltered 
  } = useFilters();
  
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get available options
  const periodOptions = getAvailablePeriods();
  const departmentOptions = getAvailableDepartments();
  const regionOptions = getAvailableRegions();
  
  // Handle period change
  const handlePeriodChange = (value: string) => {
    setPeriod(value as Period);
    
    if (onChange) {
      onChange({
        period: value as Period, 
        department, 
        region
      });
    }
  };
  
  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setDepartment(value as Department);
    
    if (onChange) {
      onChange({
        period, 
        department: value as Department, 
        region
      });
    }
  };
  
  // Handle region change
  const handleRegionChange = (value: string) => {
    setRegion(value as Region);
    
    if (onChange) {
      onChange({
        period, 
        department, 
        region: value as Region
      });
    }
  };
  
  // Handle reset
  const handleReset = () => {
    resetFilters();
    
    if (onChange) {
      onChange({
        period: 'Q2_2024', 
        department: 'All Departments', 
        region: 'All Regions'
      });
    }
    
    setIsOpen(false);
  };
  
  // If compact mode and on mobile, use popover
  if (compact && isMobile) {
    return (
      <div className={cn("flex items-center", className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8 gap-1",
                isFiltered && "border-primary text-primary"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Filters</span>
              {isFiltered && <span className="ml-1 rounded-full bg-primary/20 px-1 text-xs">Active</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm mb-2">Dashboard Filters</h4>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Period</label>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {showDepartment && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <Select value={department} onValueChange={handleDepartmentChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {showRegion && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Region</label>
                  <Select value={region} onValueChange={handleRegionChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {showReset && isFiltered && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={handleReset}
                >
                  <FilterX className="h-3.5 w-3.5 mr-2" />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  // Regular display for larger screens or non-compact mode
  return (
    <div className={cn(
      "flex gap-2 items-center flex-wrap",
      compact ? 'max-w-md' : 'w-full',
      className
    )}>
      <div className={cn(
        "flex items-center gap-2",
        compact ? 'flex-wrap' : 'flex-1 flex-wrap'
      )}>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className={cn(
              "border-dashed",
              compact ? 'w-[130px]' : 'w-[160px]'
            )}>
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showDepartment && (
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <Select value={department} onValueChange={handleDepartmentChange}>
              <SelectTrigger className={cn(
                "border-dashed",
                compact ? 'w-[150px]' : 'w-[180px]'
              )}>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {showRegion && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger className={cn(
                "border-dashed",
                compact ? 'w-[150px]' : 'w-[180px]'
              )}>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {showReset && isFiltered && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9" 
          onClick={handleReset}
        >
          <FilterX className="h-3.5 w-3.5 mr-2" />
          <span className="sr-only sm:not-sr-only">Reset</span>
        </Button>
      )}
    </div>
  );
};

export default DashboardFilters;