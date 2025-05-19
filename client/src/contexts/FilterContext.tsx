import React, { createContext, useContext, useState, useEffect } from 'react';
import { Period, Department, Region } from '@shared/schema';

// Default values for filters
const DEFAULT_PERIOD: Period = 'Q2_2024';
const DEFAULT_DEPARTMENT: Department = 'All Departments';
const DEFAULT_REGION: Region = 'All Regions';

// Context interface
interface FilterContextType {
  period: Period;
  department: Department;
  region: Region;
  setPeriod: (period: Period) => void;
  setDepartment: (department: Department) => void;
  setRegion: (region: Region) => void;
  resetFilters: () => void;
  isFiltered: boolean;
}

// Create context with default values
const FilterContext = createContext<FilterContextType>({
  period: DEFAULT_PERIOD,
  department: DEFAULT_DEPARTMENT,
  region: DEFAULT_REGION,
  setPeriod: () => {},
  setDepartment: () => {},
  setRegion: () => {},
  resetFilters: () => {},
  isFiltered: false
});

// Custom hook to use filter context
export const useFilters = () => useContext(FilterContext);

// Provider component to wrap the application
export const FilterProvider: React.FC<{
  children: React.ReactNode,
  initialPeriod?: Period,
  initialDepartment?: Department,
  initialRegion?: Region
}> = ({ 
  children, 
  initialPeriod = DEFAULT_PERIOD,
  initialDepartment = DEFAULT_DEPARTMENT,
  initialRegion = DEFAULT_REGION
}) => {
  // State for filters
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [department, setDepartment] = useState<Department>(initialDepartment);
  const [region, setRegion] = useState<Region>(initialRegion);
  
  // Determine if filters have been applied (not using defaults)
  const isFiltered = 
    period !== DEFAULT_PERIOD || 
    department !== DEFAULT_DEPARTMENT || 
    region !== DEFAULT_REGION;
  
  // Reset filters to defaults
  const resetFilters = () => {
    setPeriod(DEFAULT_PERIOD);
    setDepartment(DEFAULT_DEPARTMENT);
    setRegion(DEFAULT_REGION);
  };
  
  // Context value
  const value = {
    period,
    department,
    region,
    setPeriod,
    setDepartment,
    setRegion,
    resetFilters,
    isFiltered
  };
  
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Helper function to format period for display
export function formatPeriod(period: Period): string {
  // Replace underscores with spaces and format nicely
  return period.replace('_', ' ');
}

// Helper function to get available periods
export function getAvailablePeriods(): Array<{value: Period, label: string}> {
  return [
    { value: 'Q1_2023', label: 'Q1 2023' },
    { value: 'Q2_2023', label: 'Q2 2023' },
    { value: 'Q3_2023', label: 'Q3 2023' },
    { value: 'Q4_2023', label: 'Q4 2023' },
    { value: 'Q1_2024', label: 'Q1 2024' },
    { value: 'Q2_2024', label: 'Q2 2024' },
    { value: 'Q3_2024', label: 'Q3 2024' },
    { value: 'Q4_2024', label: 'Q4 2024' }
  ];
}

// Helper function to get available departments
export function getAvailableDepartments(): Array<{value: Department, label: string}> {
  return [
    { value: 'All Departments', label: 'All Departments' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Operations', label: 'Operations' },
    { value: 'R&D', label: 'Research & Development' }
  ];
}

// Helper function to get available regions
export function getAvailableRegions(): Array<{value: Region, label: string}> {
  return [
    { value: 'All Regions', label: 'All Regions' },
    { value: 'North America', label: 'North America' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia Pacific', label: 'Asia Pacific' },
    { value: 'Latin America', label: 'Latin America' }
  ];
}