import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { MessageSquare, Users, FileEdit, Calendar, Plus, Upload, Clock, Download } from "lucide-react";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FinancialCalendar from "@/components/calendar/FinancialCalendar";

const Collaboration = () => {
  const [filters, setFilters] = useState({
    period: defaultFilters.period,
    department: defaultFilters.department,
    region: defaultFilters.region
  });
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const response = await fetch("/api/activities?limit=10");
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
        ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  };
  
  return (
    <>
      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-500">Collaboration Hub</h2>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="activity" className="mb-6">
        <TabsList>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Team Activity</CardTitle>
                  <CardDescription>
                    Recent activity from your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-400">Loading activities...</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {activities && activities.map((activity) => (
                        <div className="flex" key={activity.id}>
                          <div className="mr-4 flex flex-col items-center">
                            <Avatar className="h-10 w-10 bg-neutral-100">
                              <AvatarFallback className="text-xs font-medium text-neutral-500">
                                {activity.userId === 1 ? "JD" : "UK"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="w-px h-full bg-neutral-200 my-2"></div>
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-x-2 mb-1">
                              <p className="text-sm font-medium text-neutral-500">
                                {activity.userId === 1 ? "John Doe" : "Unknown User"}
                              </p>
                              <p className="text-sm text-neutral-400">{activity.description}</p>
                            </div>
                            <p className="text-xs text-neutral-400 mb-3">
                              {formatDate(activity.timestamp.toString())}
                            </p>
                            
                            {activity.hasAttachment && (
                              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                {activity.attachmentType === 'image' && (
                                  <div className="w-full h-32 bg-neutral-200 rounded-lg mb-3 flex items-center justify-center">
                                    <p className="text-neutral-400 text-sm">Image attachment</p>
                                  </div>
                                )}
                                <p className="text-sm text-neutral-500">{activity.additionalText}</p>
                              </div>
                            )}
                            
                            {!activity.hasAttachment && activity.additionalText && (
                              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                <p className="text-sm text-neutral-500">{activity.additionalText}</p>
                              </div>
                            )}
                            
                            <div className="flex gap-4 mt-3">
                              <button className="text-xs text-neutral-400 hover:text-neutral-500 flex items-center gap-1">
                                <i className="ri-chat-1-line"></i>
                                <span>Comment</span>
                              </button>
                              <button className="text-xs text-neutral-400 hover:text-neutral-500 flex items-center gap-1">
                                <i className="ri-share-line"></i>
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button variant="ghost" className="w-full mt-5 text-primary">
                    <span>View More Activity</span>
                    <i className="ri-arrow-down-s-line ml-1"></i>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    People working on this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-neutral-400">Financial Director</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-secondary/10 text-secondary">AK</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Alicia Kim</p>
                          <p className="text-xs text-neutral-400">Financial Analyst</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-accent/10 text-accent">MB</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Michael Brown</p>
                          <p className="text-xs text-neutral-400">Budget Manager</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-neutral-300"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-warning/10 text-warning">JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Jane Smith</p>
                          <p className="text-xs text-neutral-400">Sales Director</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Team Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>
                    Financial planning milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-fit pt-1">
                        <div className="flex flex-col items-center">
                          <div className="bg-primary/10 text-primary text-sm font-semibold h-10 w-10 rounded flex items-center justify-center">
                            20
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">Oct</div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Q3 Financial Review</p>
                        <p className="text-xs text-neutral-400 mt-1">Complete quarterly financial analysis</p>
                        <div className="flex gap-2 mt-2">
                          <div className="flex -space-x-2">
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px]">JD</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px]">AK</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            2 days left
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="min-w-fit pt-1">
                        <div className="flex flex-col items-center">
                          <div className="bg-accent/10 text-accent text-sm font-semibold h-10 w-10 rounded flex items-center justify-center">
                            25
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">Oct</div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Budget Planning</p>
                        <p className="text-xs text-neutral-400 mt-1">Finalize Q4 departmental budgets</p>
                        <div className="flex gap-2 mt-2">
                          <div className="flex -space-x-2">
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px]">MB</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px]">JS</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            1 week left
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="min-w-fit pt-1">
                        <div className="flex flex-col items-center">
                          <div className="bg-warning/10 text-warning text-sm font-semibold h-10 w-10 rounded flex items-center justify-center">
                            31
                          </div>
                          <div className="text-xs text-neutral-400 mt-1">Oct</div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Forecast Presentation</p>
                        <p className="text-xs text-neutral-400 mt-1">Present Q4 forecast to leadership</p>
                        <div className="flex gap-2 mt-2">
                          <div className="flex -space-x-2">
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px]">JD</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            2 weeks left
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Q4 Budget Planning</CardTitle>
                  <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">In Progress</div>
                </div>
                <CardDescription>
                  Finalizing Q4 budgets for all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Progress</p>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">65% Complete</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Team</p>
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">MB</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">AK</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Deadline</p>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>October 25, 2023</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">View Project</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Financial Forecasting</CardTitle>
                  <div className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">Active</div>
                </div>
                <CardDescription>
                  Developing Q1 2024 financial projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Progress</p>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">40% Complete</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Team</p>
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">AK</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Deadline</p>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>November 15, 2023</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">View Project</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Cost Optimization</CardTitle>
                  <div className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">Planning</div>
                </div>
                <CardDescription>
                  Identifying cost-saving opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Progress</p>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-warning h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">15% Complete</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Team</p>
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">MB</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="text-xs">JS</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Deadline</p>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>December 10, 2023</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">View Project</Button>
                </div>
              </CardContent>
            </Card>
            
            <Dialog>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center p-10 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-base font-medium text-neutral-500">Create New Project</p>
                  <p className="text-sm text-neutral-400 mt-1">Start a new financial collaboration</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input placeholder="Enter project name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Enter project description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deadline</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents</CardTitle>
              <CardDescription>
                Financial documents shared with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <FileEdit className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-500">Q3 Financial Review.xlsx</p>
                      <span className="text-xs text-neutral-400">2.4 MB</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-400">Updated 2 days ago by John Doe</span>
                    </div>
                  </div>
                  <button className="p-2 text-neutral-400 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mr-3">
                    <FileEdit className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-500">Marketing Budget Proposal.pptx</p>
                      <span className="text-xs text-neutral-400">4.8 MB</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-400">Updated 4 days ago by Jane Smith</span>
                    </div>
                  </div>
                  <button className="p-2 text-neutral-400 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                    <FileEdit className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-500">Annual Budget Template.xlsx</p>
                      <span className="text-xs text-neutral-400">1.2 MB</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-400">Updated 1 week ago by Michael Brown</span>
                    </div>
                  </div>
                  <button className="p-2 text-neutral-400 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center mr-3">
                    <FileEdit className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-500">Q4 Sales Forecast.docx</p>
                      <span className="text-xs text-neutral-400">950 KB</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-400">Updated 2 weeks ago by Alicia Kim</span>
                    </div>
                  </div>
                  <button className="p-2 text-neutral-400 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                  <Button variant="ghost">View All Documents</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <FinancialCalendar />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Collaboration;
