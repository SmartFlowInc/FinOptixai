import React, { useState } from 'react';
import FinancialCalendar from '@/components/calendar/FinancialCalendar';
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Users,
  File,
  Bell,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ListChecks,
  AlertCircle,
  FileText,
  Check,
  X,
  Undo,
  Download
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState('June 2025');
  const [currentView, setCurrentView] = useState('month');

  // Sample stats for the premium header
  const headerStats = [
    {
      title: "Upcoming Events",
      value: "12",
      icon: <CalendarIcon className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Financial Deadlines",
      value: "5",
      icon: <AlertCircle className="h-5 w-5" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      title: "Scheduled Reports",
      value: "8",
      icon: <FileText className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Team Meetings",
      value: "7",
      icon: <Users className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        New Event
      </Button>
    </>
  );

  // Sample events data for calendar
  const events = [
    {
      id: 1,
      title: "Monthly Financial Review",
      description: "Review of monthly financial statements and KPIs",
      date: "2025-06-15",
      time: "10:00 AM - 11:30 AM",
      type: "meeting",
      priority: "medium",
      attendees: [
        { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", role: "Finance Director" },
        { name: "Michael Park", avatar: "/avatars/michael.jpg", role: "Senior Analyst" },
        { name: "Jamie Rodriguez", avatar: "/avatars/jamie.jpg", role: "Budget Manager" }
      ],
      location: "Finance Conference Room",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Q2 Tax Filing Deadline",
      description: "Deadline for Q2 quarterly tax filings",
      date: "2025-06-20",
      time: "11:59 PM",
      type: "deadline",
      priority: "high",
      assignees: [
        { name: "Thomas Wilson", avatar: "/avatars/thomas.jpg", role: "Accounting Lead" },
        { name: "Aisha Johnson", avatar: "/avatars/aisha.jpg", role: "Financial Controller" }
      ],
      status: "upcoming"
    },
    {
      id: 3,
      title: "Budget Planning Session",
      description: "Preliminary planning for Q3 budget allocation",
      date: "2025-06-18",
      time: "2:00 PM - 4:00 PM",
      type: "meeting",
      priority: "medium",
      attendees: [
        { name: "Rachel Wong", avatar: "/avatars/rachel.jpg", role: "Senior Analyst" },
        { name: "James Peterson", avatar: "/avatars/james.jpg", role: "Budget Director" },
        { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", role: "Finance Director" }
      ],
      location: "Executive Boardroom",
      status: "confirmed"
    },
    {
      id: 4,
      title: "Financial Report Distribution",
      description: "Monthly financial reports sent to stakeholders",
      date: "2025-06-10",
      time: "9:00 AM",
      type: "report",
      priority: "medium",
      assignees: [
        { name: "Michael Park", avatar: "/avatars/michael.jpg", role: "Senior Analyst" }
      ],
      status: "completed"
    },
    {
      id: 5,
      title: "Audit Committee Meeting",
      description: "Quarterly audit committee review",
      date: "2025-06-25",
      time: "1:00 PM - 3:00 PM",
      type: "meeting",
      priority: "high",
      attendees: [
        { name: "David Kim", avatar: "/avatars/david.jpg", role: "Compliance Officer" },
        { name: "Aisha Johnson", avatar: "/avatars/aisha.jpg", role: "Financial Controller" },
        { name: "Thomas Wilson", avatar: "/avatars/thomas.jpg", role: "Accounting Lead" }
      ],
      location: "Main Conference Room",
      status: "confirmed"
    }
  ];

  // Helper function to get event type badge
  const getEventTypeBadge = (type) => {
    switch (type) {
      case 'meeting':
        return <Badge className="bg-blue-50 text-blue-700">Meeting</Badge>;
      case 'deadline':
        return <Badge className="bg-red-50 text-red-700">Deadline</Badge>;
      case 'report':
        return <Badge className="bg-green-50 text-green-700">Report</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{type}</Badge>;
    }
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-50 text-red-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-50 text-amber-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-100 text-slate-700">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{priority}</Badge>;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-50 text-green-700">Confirmed</Badge>;
      case 'tentative':
        return <Badge className="bg-amber-50 text-amber-700">Tentative</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-50 text-blue-700">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-slate-100 text-slate-700">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-50 text-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  return (
    <>
      <PremiumPageHeader
        title="Financial Calendar"
        description="Track important financial dates, deadlines, and meetings in one place"
        icon={<CalendarIcon className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ListChecks className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Deadlines
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Undo className="h-4 w-4 mr-2" />
            Recurrence
          </TabsTrigger>
        </TabsList>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Month
              </Button>
              <Button variant="ghost">Week</Button>
              <Button variant="ghost">Day</Button>
              <Button variant="ghost">Agenda</Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-slate-200">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{currentMonth}</div>
              <Button variant="outline" size="sm" className="border-slate-200">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8] ml-4">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">Today</span>
              </Button>
            </div>
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
          >
            <div className="p-4">
              {/* Calendar Header - Days of the Week */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="py-2 text-center font-medium text-sm text-slate-500">{day}</div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* First week of June */}
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">26</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">27</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">28</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">29</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">30</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">31</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">1</div>
                </div>
                
                {/* Second week */}
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">2</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">3</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">4</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">5</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">6</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">7</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">8</div>
                </div>
                
                {/* Third week */}
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">9</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200 border-blue-100">
                  <div className="text-right text-sm p-1">10</div>
                  <div className="p-1 rounded text-xs bg-green-100 text-green-800 truncate mb-1">
                    9:00 - Financial Report Distribution
                  </div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">11</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">12</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">13</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">14</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-blue-100">
                  <div className="text-right text-sm p-1 font-medium text-blue-600">15</div>
                  <div className="p-1 rounded text-xs bg-blue-100 text-blue-800 truncate mb-1">
                    10:00 - Monthly Financial Review
                  </div>
                </div>
                
                {/* Fourth week */}
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">16</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">17</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-blue-100">
                  <div className="text-right text-sm p-1">18</div>
                  <div className="p-1 rounded text-xs bg-blue-100 text-blue-800 truncate mb-1">
                    2:00 - Budget Planning Session
                  </div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">19</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-red-100">
                  <div className="text-right text-sm p-1 font-medium text-red-600">20</div>
                  <div className="p-1 rounded text-xs bg-red-100 text-red-800 truncate mb-1">
                    11:59 - Q2 Tax Filing Deadline
                  </div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">21</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">22</div>
                </div>
                
                {/* Fifth week */}
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">23</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">24</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-blue-100">
                  <div className="text-right text-sm p-1">25</div>
                  <div className="p-1 rounded text-xs bg-blue-100 text-blue-800 truncate mb-1">
                    1:00 - Audit Committee Meeting
                  </div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">26</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">27</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">28</div>
                </div>
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">29</div>
                </div>
                
                {/* Sixth week */}
                <div className="min-h-[100px] p-1 bg-white border border-slate-200">
                  <div className="text-right text-sm p-1">30</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">1</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">2</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">3</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">4</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">5</div>
                </div>
                <div className="min-h-[100px] p-1 bg-slate-50 border border-slate-200">
                  <div className="text-right text-sm p-1 text-slate-400">6</div>
                </div>
              </div>
            </div>
          </PremiumCard>
          
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 mr-4">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-600">Meeting</span>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600">Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-600">Report</span>
            </div>
          </div>
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search events..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Events</h3>
                  <p className="text-sm text-slate-500">All scheduled events and meetings</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="meeting">Meetings</SelectItem>
                      <SelectItem value="deadline">Deadlines</SelectItem>
                      <SelectItem value="report">Reports</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="upcoming">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                          event.type === 'meeting' ? 'bg-blue-500' :
                          event.type === 'deadline' ? 'bg-red-500' :
                          'bg-green-500'
                        }`}>
                          {event.type === 'meeting' ? <Users className="h-5 w-5" /> :
                           event.type === 'deadline' ? <AlertCircle className="h-5 w-5" /> :
                           <File className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {getEventTypeBadge(event.type)}
                            {getPriorityBadge(event.priority)}
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              <span>{event.date.split('-')[2]} {monthNumberToName(event.date.split('-')[1])} {event.date.split('-')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{event.time}</span>
                            </div>
                            {event.location && (
                              <div className="text-sm text-slate-500">
                                Location: {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {(event.attendees || event.assignees) && (
                          <div className="flex flex-col items-end">
                            <div className="text-xs text-slate-500 mb-1">
                              {event.attendees ? 'Attendees' : 'Assignees'}:
                            </div>
                            <div className="flex -space-x-2">
                              {(event.attendees || event.assignees).map((person, idx) => (
                                <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                                  <AvatarFallback className="bg-slate-200 text-xs">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {event.status !== 'completed' && event.status !== 'cancelled' && (
                            <>
                              <Button variant="outline" size="sm" className="h-8 text-green-600 border-green-200 hover:bg-green-50">
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Complete</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Cancel</span>
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" className="h-8 text-slate-500">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Other tabs would go here */}
      </Tabs>
      
      <div className="hidden">
        <FinancialCalendar />
      </div>
    </>
  );
};

// Helper function to convert month number to name
function monthNumberToName(monthNum) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNum) - 1];
}

export default Calendar;