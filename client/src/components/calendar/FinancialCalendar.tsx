import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Define types for financial events
type EventType = 'deadline' | 'meeting' | 'report' | 'tax' | 'budget' | 'audit';

interface FinancialEvent {
  id: number;
  title: string;
  date: Date;
  description: string;
  type: EventType;
  completed: boolean;
}

// Sample event data
const sampleEvents: FinancialEvent[] = [
  {
    id: 1,
    title: "Q4 Tax Filing Deadline",
    date: new Date(2025, 0, 15), // January 15, 2025
    description: "Quarterly tax filing deadline for Q4 2024",
    type: "tax",
    completed: false
  },
  {
    id: 2,
    title: "Annual Budget Submission",
    date: new Date(2025, 0, 31), // January 31, 2025
    description: "Deadline for submitting annual budget for 2025",
    type: "budget",
    completed: false
  },
  {
    id: 3,
    title: "Financial Committee Meeting",
    date: new Date(2025, 1, 10), // February 10, 2025
    description: "Monthly financial committee meeting",
    type: "meeting",
    completed: false
  },
  {
    id: 4,
    title: "Annual Audit Preparation",
    date: new Date(2025, 1, 15), // February 15, 2025
    description: "Prepare documentation for annual audit",
    type: "audit",
    completed: false
  },
  {
    id: 5,
    title: "Monthly Financial Report",
    date: new Date(2025, 1, 28), // February 28, 2025
    description: "Prepare and submit monthly financial report",
    type: "report",
    completed: false
  },
  {
    id: 6,
    title: "Q1 Forecast Review",
    date: new Date(2025, 2, 15), // March 15, 2025
    description: "Review Q1 2025 financial forecasts",
    type: "meeting",
    completed: false
  },
  {
    id: 7,
    title: "Tax Season Final Preparations",
    date: new Date(2025, 3, 1), // April 1, 2025
    description: "Final preparations for annual tax filing",
    type: "tax",
    completed: false
  },
  {
    id: 8,
    title: "Annual Tax Filing Deadline",
    date: new Date(2025, 3, 15), // April 15, 2025
    description: "Annual corporate tax filing deadline",
    type: "tax",
    completed: false
  }
];

// Get event type color class
const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case 'deadline':
      return 'bg-red-100 text-red-800';
    case 'meeting':
      return 'bg-blue-100 text-blue-800';
    case 'report':
      return 'bg-purple-100 text-purple-800';
    case 'tax':
      return 'bg-amber-100 text-amber-800';
    case 'budget':
      return 'bg-green-100 text-green-800';
    case 'audit':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

interface FinancialCalendarProps {
  isLoading?: boolean;
}

const FinancialCalendar: React.FC<FinancialCalendarProps> = ({ isLoading = false }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<FinancialEvent[]>(sampleEvents);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [view, setView] = useState<'month' | 'list'>('month');
  const [newEvent, setNewEvent] = useState<Partial<FinancialEvent>>({
    title: '',
    description: '',
    type: 'meeting',
    date: new Date(),
    completed: false
  });
  const [openDialog, setOpenDialog] = useState(false);
  
  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Get events for selected month
  const getEventsForMonth = (date: Date, type: EventType | 'all' = 'all') => {
    return events.filter(event => {
      const typeMatch = type === 'all' || event.type === type;
      return event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear() &&
        typeMatch;
    });
  };
  
  // Check if a date has events
  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  // Filter events by type
  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.type === filterType);

  // Add a new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
      const eventToAdd = {
        id: newId,
        title: newEvent.title,
        date: newEvent.date,
        description: newEvent.description || '',
        type: newEvent.type as EventType || 'meeting',
        completed: false
      };
      
      setEvents([...events, eventToAdd]);
      setNewEvent({
        title: '',
        description: '',
        type: 'meeting',
        date: new Date(),
        completed: false
      });
      setOpenDialog(false);
    }
  };

  // Toggle event completion status
  const toggleEventCompletion = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };
  
  // For loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-neutral-200 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-neutral-200 h-4 w-64 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-neutral-200 h-64 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Financial Calendar</CardTitle>
            <CardDescription>
              Track important financial dates and deadlines
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as EventType | 'all')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex rounded-md overflow-hidden">
              <Button 
                variant={view === 'month' ? 'default' : 'outline'} 
                onClick={() => setView('month')}
                className="rounded-r-none"
              >
                Month
              </Button>
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                onClick={() => setView('list')}
                className="rounded-l-none"
              >
                List
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'month' ? (
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: date => hasEvents(date),
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/20",
                }}
              />
              
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">Meeting</Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">Report</Badge>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">Tax</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">Budget</Badge>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Audit</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800">Deadline</Badge>
              </div>
            </div>
            
            <div className="flex-1 border-t xl:border-t-0 xl:border-l pt-6 xl:pt-0 xl:pl-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
                </h3>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <span className="mr-2">+</span> Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Financial Event</DialogTitle>
                      <DialogDescription>
                        Create a new event for your financial calendar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Event Title</label>
                        <Input 
                          placeholder="Enter event title" 
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Event Type</label>
                        <Select 
                          value={newEvent.type as string} 
                          onValueChange={(value) => setNewEvent({...newEvent, type: value as EventType})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deadline">Deadline</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="report">Report</SelectItem>
                            <SelectItem value="tax">Tax</SelectItem>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="audit">Audit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              {newEvent.date ? (
                                format(newEvent.date, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={newEvent.date}
                              onSelect={(date) => setNewEvent({...newEvent, date})}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          placeholder="Enter event description" 
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                      <Button onClick={handleAddEvent}>Add Event</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3">
                {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <h4 className={`font-medium ${event.completed ? 'line-through text-neutral-500' : ''}`}>
                            {event.title}
                          </h4>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleEventCompletion(event.id)}
                        >
                          {event.completed ? 'Mark Incomplete' : 'Mark Complete'}
                        </Button>
                      </div>
                      {event.description && (
                        <p className="text-sm text-neutral-500 mt-2">{event.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-neutral-500">
                    {selectedDate ? 'No events for this date' : 'Select a date to view events'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'No month selected'}
              </h3>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <span className="mr-2">+</span> Add Event
                  </Button>
                </DialogTrigger>
                {/* Dialog content is same as above */}
              </Dialog>
            </div>
            
            <div className="space-y-1">
              {selectedDate && getEventsForMonth(selectedDate, filterType).length > 0 ? (
                getEventsForMonth(selectedDate, filterType)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <div key={event.id} className="border rounded-lg overflow-hidden">
                      <div className={`px-4 py-2 ${getEventTypeColor(event.type)}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{format(event.date, 'MMM d, yyyy')}</span>
                          <Badge variant="outline" className="bg-white bg-opacity-80">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${event.completed ? 'line-through text-neutral-500' : ''}`}>
                            {event.title}
                          </h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleEventCompletion(event.id)}
                          >
                            {event.completed ? 'Mark Incomplete' : 'Mark Complete'}
                          </Button>
                        </div>
                        {event.description && (
                          <p className="text-sm text-neutral-500 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center p-8 text-neutral-500">
                  {selectedDate 
                    ? `No ${filterType !== 'all' ? filterType : ''} events for ${format(selectedDate, 'MMMM yyyy')}` 
                    : 'Select a month to view events'
                  }
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
          </div>
          
          <div className="space-y-3">
            {events
              .filter(event => event.date > new Date() && !event.completed)
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 3)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                      {event.date.getDate()}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-neutral-500">{format(event.date, 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                </div>
              ))}
              
            {events.filter(event => event.date > new Date() && !event.completed).length === 0 && (
              <div className="text-center p-4 text-neutral-500">
                No upcoming events
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialCalendar;