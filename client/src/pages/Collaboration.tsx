import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskManagement from "@/components/collaboration/TaskManagement";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Copy,
  Edit,
  Eye,
  FileText,
  ListChecks,
  MessageSquare,
  MessagesSquare,
  PlusCircle,
  Search,
  Settings,
  Trash,
  Users,
  Zap
} from "lucide-react";

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState<string>("task-management");
  const [selectedProcess, setSelectedProcess] = useState<string>("monthly_close");

  // Mock data for recent comments
  const recentComments = [
    {
      id: 1,
      user: {
        name: "Jane Smith",
        avatar: "JS",
        avatarColor: "bg-green-100 text-green-800"
      },
      content: "I've updated the revenue projections based on the new sales data. We're seeing a 15% increase over previous estimates.",
      time: "2 hours ago",
      document: "Q2 Financial Forecast"
    },
    {
      id: 2,
      user: {
        name: "Michael Brown",
        avatar: "MB",
        avatarColor: "bg-purple-100 text-purple-800"
      },
      content: "The reconciliation for NA region is complete. There were a few discrepancies in the marketing expenses that I've addressed.",
      time: "Yesterday",
      document: "April Account Reconciliation"
    },
    {
      id: 3,
      user: {
        name: "Alicia Kim",
        avatar: "AK",
        avatarColor: "bg-amber-100 text-amber-800"
      },
      content: "I've added notes to the variance explanation for the IT department. They're 15% under budget due to delayed infrastructure upgrades.",
      time: "2 days ago",
      document: "Budget Variance Report"
    }
  ];

  // Mock data for teams
  const teams = [
    {
      id: 1,
      name: "Finance Core Team",
      members: 8,
      activeTasks: 12,
      lastActive: "Today",
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: "Core finance team responsible for financial reporting and analysis"
    },
    {
      id: 2,
      name: "Accounting & Reconciliation",
      members: 5,
      activeTasks: 7,
      lastActive: "Yesterday",
      icon: <ListChecks className="h-5 w-5 text-green-600" />,
      description: "Team focused on account reconciliations and month-end close"
    },
    {
      id: 3,
      name: "FP&A",
      members: 6,
      activeTasks: 9,
      lastActive: "Today",
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      description: "Financial planning and analysis team for forecasting and budgeting"
    },
    {
      id: 4,
      name: "Executive Review",
      members: 4,
      activeTasks: 3,
      lastActive: "3 days ago",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      description: "Executive team for financial review and strategic decisions"
    }
  ];

  // Mock data for recent financial documents
  const recentDocuments = [
    {
      id: 1,
      title: "Q2 Financial Review",
      type: "Presentation",
      lastUpdated: "Today",
      updatedBy: "Jane Smith",
      comments: 8,
      status: "In Progress"
    },
    {
      id: 2,
      title: "April Month-End Close Checklist",
      type: "Spreadsheet",
      lastUpdated: "Yesterday",
      updatedBy: "Michael Brown",
      comments: 12,
      status: "Completed"
    },
    {
      id: 3,
      title: "Budget vs. Actual - Q2",
      type: "Spreadsheet",
      lastUpdated: "2 days ago",
      updatedBy: "John Doe",
      comments: 5,
      status: "In Review"
    },
    {
      id: 4,
      title: "Cash Flow Projections",
      type: "Spreadsheet",
      lastUpdated: "3 days ago",
      updatedBy: "David Chen",
      comments: 3,
      status: "Completed"
    }
  ];

  // Process dropdown options
  const processOptions = [
    { value: "monthly_close", label: "Monthly Close Process" },
    { value: "quarterly_review", label: "Quarterly Financial Review" },
    { value: "annual_budget", label: "Annual Budget Planning" },
    { value: "tax_preparation", label: "Tax Preparation" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Collaboration Hub</h1>
          <p className="text-neutral-600">
            Collaborate with your team on financial tasks and processes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProcess} onValueChange={setSelectedProcess}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              {processOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Process
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto gap-4">
          <TabsTrigger value="task-management" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Task Management</div>
              <div className="text-xs text-neutral-500">Manage financial tasks</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Calendar</div>
              <div className="text-xs text-neutral-500">Financial events & deadlines</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Documents</div>
              <div className="text-xs text-neutral-500">Shared financial documents</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="teams" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Teams</div>
              <div className="text-xs text-neutral-500">Financial team management</div>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Task Management Tab */}
        <TabsContent value="task-management">
          <TaskManagement activeProcess={selectedProcess} />
        </TabsContent>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Financial Calendar</CardTitle>
              <CardDescription>
                View and manage financial deadlines, events, and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-4">
                  Our enhanced financial calendar is under development. It will include deadline tracking, 
                  event management, and integration with your financial workflows.
                </p>
                <Button>
                  View Calendar (Preview)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Documents</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative w-[200px]">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                        <Input placeholder="Search documents..." className="pl-8" />
                      </div>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Document
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Recently updated financial documents and reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Title</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Type</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Last Updated</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recentDocuments.map(doc => (
                          <tr key={doc.id} className="hover:bg-neutral-50">
                            <td className="py-3 px-4">
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-sm text-neutral-500">Updated by {doc.updatedBy}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm">{doc.type}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-400" />
                                <span className="text-sm">{doc.lastUpdated}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                className={`
                                  ${doc.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                    doc.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    'bg-amber-100 text-amber-800'}
                                `}
                              >
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MessageSquare className="h-4 w-4" />
                                  <span className="ml-1 text-xs">{doc.comments}</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Comments</CardTitle>
                  <CardDescription>Recent comments on financial documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {recentComments.map(comment => (
                        <div key={comment.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className={comment.user.avatarColor + " text-xs"}>
                                  {comment.user.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{comment.user.name}</span>
                            </div>
                            <span className="text-xs text-neutral-500">{comment.time}</span>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">{comment.content}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-neutral-500">
                            <span>On: {comment.document}</span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Reply</Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Teams Tab */}
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Financial Teams</CardTitle>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </div>
                  <CardDescription>
                    Manage your financial teams and their tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teams.map(team => (
                      <Card key={team.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {team.icon}
                              </div>
                              <div>
                                <h3 className="font-medium">{team.name}</h3>
                                <p className="text-xs text-neutral-500">{team.description}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-lg font-medium">{team.members}</div>
                                <div className="text-xs text-neutral-500">Members</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-medium">{team.activeTasks}</div>
                                <div className="text-xs text-neutral-500">Tasks</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm">{team.lastActive}</div>
                                <div className="text-xs text-neutral-500">Last Active</div>
                              </div>
                            </div>
                            <div className="flex -space-x-2">
                              {[...Array(Math.min(3, team.members))].map((_, i) => (
                                <Avatar key={i} className="h-7 w-7 border-2 border-background">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {String.fromCharCode(65 + i)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {team.members > 3 && (
                                <Avatar className="h-7 w-7 border-2 border-background">
                                  <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xs">
                                    +{team.members - 3}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <Button variant="outline" size="sm">
                              <ListChecks className="h-4 w-4 mr-2" />
                              View Tasks
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-2" />
                              Team Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Team Activity</CardTitle>
                  <CardDescription>Recent activity across all teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      <div className="border-l-2 border-primary pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-primary"></div>
                        <div className="text-sm">
                          <span className="font-medium">Jane Smith</span> completed task <span className="font-medium">April Reconciliation</span>
                        </div>
                        <div className="text-xs text-neutral-500">Today, 2:30 PM</div>
                      </div>
                      
                      <div className="border-l-2 border-blue-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">FP&A Team</span> created 3 new forecast scenarios for <span className="font-medium">Q3 Planning</span>
                        </div>
                        <div className="text-xs text-neutral-500">Today, 11:15 AM</div>
                      </div>
                      
                      <div className="border-l-2 border-amber-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-amber-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">Michael Brown</span> added comments to <span className="font-medium">Budget Variance Report</span>
                        </div>
                        <div className="text-xs text-neutral-500">Yesterday, 4:45 PM</div>
                      </div>
                      
                      <div className="border-l-2 border-green-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">David Chen</span> shared <span className="font-medium">Cash Flow Projections</span> with Executive Team
                        </div>
                        <div className="text-xs text-neutral-500">Yesterday, 2:20 PM</div>
                      </div>
                      
                      <div className="border-l-2 border-purple-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-purple-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">Finance Core Team</span> scheduled meeting <span className="font-medium">Monthly Close Review</span>
                        </div>
                        <div className="text-xs text-neutral-500">2 days ago</div>
                      </div>
                      
                      <div className="border-l-2 border-red-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">Alicia Kim</span> flagged issue in <span className="font-medium">Intercompany Reconciliation</span>
                        </div>
                        <div className="text-xs text-neutral-500">2 days ago</div>
                      </div>
                      
                      <div className="border-l-2 border-neutral-500 pl-4 py-1 relative">
                        <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-neutral-500"></div>
                        <div className="text-sm">
                          <span className="font-medium">New Team Member</span> joined <span className="font-medium">Accounting & Reconciliation</span>
                        </div>
                        <div className="text-xs text-neutral-500">3 days ago</div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Collaboration;