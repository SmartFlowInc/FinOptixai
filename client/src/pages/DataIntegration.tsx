import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Clock, Download, FileUp, RefreshCw, Upload, AlertTriangle, AlertCircle } from "lucide-react";

// Define types for data sources
type DataSourceType = 'erp' | 'epm' | 'crm' | 'other';
type DataCategory = 'actuals' | 'budget' | 'forecast' | 'metadata';
type ImportStatus = 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'canceled';

interface DataSource {
  id: number;
  name: string;
  type: DataSourceType;
  category: DataCategory;
  connectionString: string;
  lastSync: Date;
  nextSync: Date | null;
  status: ImportStatus;
  frequency: string;
  owner: string;
}

interface ImportJob {
  id: number;
  dataSourceId: number;
  dataSourceName: string;
  startTime: Date;
  endTime: Date | null;
  status: ImportStatus;
  recordsProcessed: number | null;
  errors: number | null;
  warnings: number | null;
  notes: string | null;
}

// Sample data
const sampleDataSources: DataSource[] = [
  {
    id: 1,
    name: 'SAP ERP Production',
    type: 'erp',
    category: 'actuals',
    connectionString: 'sap://erp.production.company.com',
    lastSync: new Date(2025, 3, 15, 23, 45, 0),
    nextSync: new Date(2025, 4, 15, 23, 0, 0),
    status: 'completed',
    frequency: 'Monthly',
    owner: 'John Doe'
  },
  {
    id: 2,
    name: 'Oracle EPM Cloud',
    type: 'epm',
    category: 'budget',
    connectionString: 'oracle://epm.cloud.company.com',
    lastSync: new Date(2025, 4, 1, 2, 15, 0),
    nextSync: new Date(2025, 5, 1, 2, 0, 0),
    status: 'scheduled',
    frequency: 'Monthly',
    owner: 'Jane Smith'
  },
  {
    id: 3,
    name: 'Salesforce CRM',
    type: 'crm',
    category: 'forecast',
    connectionString: 'salesforce://api.company.instance.com',
    lastSync: new Date(2025, 4, 10, 14, 30, 0),
    nextSync: new Date(2025, 4, 17, 14, 30, 0),
    status: 'completed',
    frequency: 'Weekly',
    owner: 'Michael Brown'
  },
  {
    id: 4,
    name: 'HR System',
    type: 'other',
    category: 'metadata',
    connectionString: 'api://hr.company.com/v2',
    lastSync: new Date(2025, 4, 5, 6, 0, 0),
    nextSync: null,
    status: 'failed',
    frequency: 'Manual',
    owner: 'Alicia Kim'
  }
];

const sampleImportJobs: ImportJob[] = [
  {
    id: 1,
    dataSourceId: 1,
    dataSourceName: 'SAP ERP Production',
    startTime: new Date(2025, 3, 15, 23, 0, 0),
    endTime: new Date(2025, 3, 15, 23, 45, 0),
    status: 'completed',
    recordsProcessed: 230450,
    errors: 0,
    warnings: 23,
    notes: 'Monthly actuals import completed successfully.'
  },
  {
    id: 2,
    dataSourceId: 2,
    dataSourceName: 'Oracle EPM Cloud',
    startTime: new Date(2025, 4, 1, 2, 0, 0),
    endTime: new Date(2025, 4, 1, 2, 15, 0),
    status: 'completed',
    recordsProcessed: 45230,
    errors: 0,
    warnings: 5,
    notes: 'Monthly budget import completed successfully.'
  },
  {
    id: 3,
    dataSourceId: 3,
    dataSourceName: 'Salesforce CRM',
    startTime: new Date(2025, 4, 10, 14, 30, 0),
    endTime: new Date(2025, 4, 10, 14, 45, 0),
    status: 'completed',
    recordsProcessed: 78120,
    errors: 0,
    warnings: 12,
    notes: 'Weekly sales forecast import completed.'
  },
  {
    id: 4,
    dataSourceId: 4,
    dataSourceName: 'HR System',
    startTime: new Date(2025, 4, 5, 6, 0, 0),
    endTime: new Date(2025, 4, 5, 6, 10, 0),
    status: 'failed',
    recordsProcessed: 5230,
    errors: 78,
    warnings: 45,
    notes: 'Failed due to API authentication issue. Please check credentials.'
  },
  {
    id: 5,
    dataSourceId: 2,
    dataSourceName: 'Oracle EPM Cloud',
    startTime: new Date(2025, 5, 1, 2, 0, 0),
    endTime: null,
    status: 'scheduled',
    recordsProcessed: null,
    errors: null,
    warnings: null,
    notes: 'Scheduled monthly budget import.'
  }
];

const DataIntegration: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(sampleDataSources);
  const [importJobs, setImportJobs] = useState<ImportJob[]>(sampleImportJobs);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newSourceOpen, setNewSourceOpen] = useState(false);
  const [newSource, setNewSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'erp',
    category: 'actuals',
    connectionString: '',
    frequency: 'Monthly'
  });
  const [scheduleImportOpen, setScheduleImportOpen] = useState(false);
  const [importSchedule, setImportSchedule] = useState({
    dataSourceId: 1,
    scheduledDate: new Date(),
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('data-sources');
  
  // Helper for status badge
  const getStatusBadge = (status: ImportStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'canceled':
        return <Badge className="bg-neutral-100 text-neutral-800">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format date helper
  const formatDateTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(date, 'MMM d, yyyy h:mm a');
  };

  // Add new data source
  const handleAddDataSource = () => {
    if (!newSource.name || !newSource.connectionString) return;
    
    const newId = Math.max(...dataSources.map(s => s.id)) + 1;
    const newDataSource: DataSource = {
      id: newId,
      name: newSource.name || '',
      type: newSource.type as DataSourceType || 'erp',
      category: newSource.category as DataCategory || 'actuals',
      connectionString: newSource.connectionString || '',
      lastSync: new Date(0), // No previous sync
      nextSync: null,
      status: 'scheduled',
      frequency: newSource.frequency || 'Monthly',
      owner: 'John Doe' // Current user would be set here
    };
    
    setDataSources([...dataSources, newDataSource]);
    setNewSourceOpen(false);
    setNewSource({
      name: '',
      type: 'erp',
      category: 'actuals',
      connectionString: '',
      frequency: 'Monthly'
    });
  };

  // Schedule new import
  const handleScheduleImport = () => {
    const dataSource = dataSources.find(ds => ds.id === importSchedule.dataSourceId);
    if (!dataSource) return;
    
    const newId = Math.max(...importJobs.map(j => j.id)) + 1;
    const newImportJob: ImportJob = {
      id: newId,
      dataSourceId: importSchedule.dataSourceId,
      dataSourceName: dataSource.name,
      startTime: importSchedule.scheduledDate,
      endTime: null,
      status: 'scheduled',
      recordsProcessed: null,
      errors: null,
      warnings: null,
      notes: importSchedule.notes || 'Scheduled import'
    };
    
    // Also update the data source to reflect the next scheduled sync
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === importSchedule.dataSourceId) {
        return {
          ...ds,
          nextSync: importSchedule.scheduledDate,
          status: 'scheduled'
        };
      }
      return ds;
    });
    
    setImportJobs([...importJobs, newImportJob]);
    setDataSources(updatedDataSources);
    setScheduleImportOpen(false);
    setImportSchedule({
      dataSourceId: 1,
      scheduledDate: new Date(),
      notes: ''
    });
  };

  // Run import now
  const handleRunNow = (sourceId: number) => {
    const dataSource = dataSources.find(ds => ds.id === sourceId);
    if (!dataSource) return;
    
    const now = new Date();
    const endTime = new Date(now.getTime() + 15 * 60000); // Simulate 15min import time
    
    const newId = Math.max(...importJobs.map(j => j.id)) + 1;
    const newImportJob: ImportJob = {
      id: newId,
      dataSourceId: sourceId,
      dataSourceName: dataSource.name,
      startTime: now,
      endTime: endTime,
      status: 'completed',
      recordsProcessed: Math.floor(Math.random() * 100000) + 10000,
      errors: 0,
      warnings: Math.floor(Math.random() * 20),
      notes: 'Manual import triggered by user'
    };
    
    // Update data source
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === sourceId) {
        return {
          ...ds,
          lastSync: endTime,
          status: 'completed'
        };
      }
      return ds;
    });
    
    setImportJobs([newImportJob, ...importJobs]);
    setDataSources(updatedDataSources);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Integration Hub</h1>
          <p className="text-muted-foreground mt-1">
            Manage data sources and schedule automated imports
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={newSourceOpen} onOpenChange={setNewSourceOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp className="mr-2 h-4 w-4" />
                Add Data Source
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Data Source</DialogTitle>
                <DialogDescription>
                  Connect a new data source for importing financial data
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Name</label>
                  <Input 
                    placeholder="e.g., SAP ERP Production" 
                    value={newSource.name}
                    onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source Type</label>
                    <Select 
                      value={newSource.type} 
                      onValueChange={(value) => setNewSource({...newSource, type: value as DataSourceType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erp">ERP System</SelectItem>
                        <SelectItem value="epm">EPM/Budgeting</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Category</label>
                    <Select 
                      value={newSource.category} 
                      onValueChange={(value) => setNewSource({...newSource, category: value as DataCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actuals">Actuals</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="forecast">Forecast</SelectItem>
                        <SelectItem value="metadata">Metadata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Connection String</label>
                  <Input 
                    placeholder="e.g., sap://erp.company.com" 
                    value={newSource.connectionString}
                    onChange={(e) => setNewSource({...newSource, connectionString: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Import Frequency</label>
                  <Select 
                    value={newSource.frequency} 
                    onValueChange={(value) => setNewSource({...newSource, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setNewSourceOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDataSource}>Add Data Source</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={scheduleImportOpen} onOpenChange={setScheduleImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Data Import</DialogTitle>
                <DialogDescription>
                  Schedule a one-time or recurring data import
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <Select 
                    value={importSchedule.dataSourceId.toString()} 
                    onValueChange={(value) => setImportSchedule({...importSchedule, dataSourceId: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map(source => (
                        <SelectItem key={source.id} value={source.id.toString()}>
                          {source.name} ({source.type.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule Date & Time</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {importSchedule.scheduledDate ? (
                            format(importSchedule.scheduledDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={importSchedule.scheduledDate}
                          onSelect={(date) => date && setImportSchedule({...importSchedule, scheduledDate: date})}
                        />
                      </PopoverContent>
                    </Popover>

                    <Select 
                      value={format(importSchedule.scheduledDate, "HH:mm")} 
                      onValueChange={(value) => {
                        const [hours, minutes] = value.split(':').map(Number);
                        const newDate = new Date(importSchedule.scheduledDate);
                        newDate.setHours(hours, minutes);
                        setImportSchedule({...importSchedule, scheduledDate: newDate});
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {hour.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input 
                    placeholder="Import description or notes" 
                    value={importSchedule.notes}
                    onChange={(e) => setImportSchedule({...importSchedule, notes: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleImportOpen(false)}>Cancel</Button>
                <Button onClick={handleScheduleImport}>Schedule Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
          <TabsTrigger value="import-history">Import History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data-sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Data Sources</CardTitle>
              <CardDescription>
                Manage your ERP, EPM, and other data source connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Import</TableHead>
                      <TableHead>Next Import</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {source.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{source.category}</TableCell>
                        <TableCell>{formatDateTime(source.lastSync)}</TableCell>
                        <TableCell>{source.nextSync ? formatDateTime(source.nextSync) : 'Not scheduled'}</TableCell>
                        <TableCell>{getStatusBadge(source.status)}</TableCell>
                        <TableCell>{source.frequency}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleRunNow(source.id)}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Clock className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Error</span>
                  </div>
                </div>
                
                <Button variant="ghost" className="text-sm">
                  Test All Connections
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>
                View all scheduled and completed data imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data Source</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importJobs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime()).map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.dataSourceName}</TableCell>
                        <TableCell>{formatDateTime(job.startTime)}</TableCell>
                        <TableCell>{job.endTime ? formatDateTime(job.endTime) : 'Pending'}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>{job.recordsProcessed !== null ? job.recordsProcessed.toLocaleString() : '—'}</TableCell>
                        <TableCell>
                          {job.errors !== null ? (
                            <div className="flex items-center gap-1">
                              {job.errors > 0 ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              <span>{job.errors.toLocaleString()}</span>
                            </div>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {job.notes || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {job.status === 'completed' && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {job.status === 'failed' && (
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            {job.status === 'scheduled' && (
                              <Button variant="ghost" size="sm">
                                <Clock className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Successful Imports</p>
                        <p className="text-2xl font-bold text-green-900">
                          {importJobs.filter(j => j.status === 'completed').length}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-amber-800">Scheduled Imports</p>
                        <p className="text-2xl font-bold text-amber-900">
                          {importJobs.filter(j => j.status === 'scheduled').length}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-50 border-red-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">Failed Imports</p>
                        <p className="text-2xl font-bold text-red-900">
                          {importJobs.filter(j => j.status === 'failed').length}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataIntegration;