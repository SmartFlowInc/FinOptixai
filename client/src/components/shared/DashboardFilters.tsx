import React from 'react';
import { useFilters, getAvailablePeriods, getAvailableDepartments, getAvailableRegions } from '@/contexts/FilterContext';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar, Building2, Globe, RotateCcw } from 'lucide-react';

interface DashboardFiltersProps {
  showReset?: boolean;
  showDepartment?: boolean;
  showRegion?: boolean;
  compact?: boolean; // For smaller mobile view
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  showReset = false,
  showDepartment = false,
  showRegion = false,
  compact = false
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
  
  // Get available options for each filter
  const periods = getAvailablePeriods();
  const departments = getAvailableDepartments();
  const regions = getAvailableRegions();
  
  return (
    <div className={`flex ${compact ? 'flex-col space-y-2' : 'flex-wrap items-center'} gap-3`}>
      {/* Period Filter */}
      <div className={`flex ${compact ? 'w-full' : 'flex-1 min-w-[150px] max-w-[200px]'}`}>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Department Filter - Optional */}
      {showDepartment && (
        <div className={`flex ${compact ? 'w-full' : 'flex-1 min-w-[150px] max-w-[200px]'}`}>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Region Filter - Optional */}
      {showRegion && (
        <div className={`flex ${compact ? 'w-full' : 'flex-1 min-w-[150px] max-w-[200px]'}`}>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Reset button - Optional */}
      {showReset && (
        <Button 
          variant="outline" 
          size={compact ? 'default' : 'sm'} 
          onClick={resetFilters}
          disabled={!isFiltered}
          className={compact ? 'w-full' : ''}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default DashboardFilters;