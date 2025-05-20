import React from "react";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  PlusCircle,
  Plus,
  Settings,
  Download,
  Search,
  Filter,
  List,
  Clipboard
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Collaboration = () => {
  // Sample stats for the premium header
  const headerStats = [
    {
      title: "Active Projects",
      value: "12",
      icon: <Clipboard className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Team Members",
      value: "24",
      icon: <Users className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Unread Messages",
      value: "7",
      icon: <MessageSquare className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Tasks Due Today",
      value: "5",
      icon: <Calendar className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Users className="mr-2 h-4 w-4" />
        Invite Team
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </>
  );

  // Sample projects data
  const projects = [
    {
      id: 1,
      name: "Q3 Financial Planning",
      description: "Comprehensive financial planning and strategy for Q3 2025",
      members: [
        { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", role: "Finance Director" },
        { name: "Michael Park", avatar: "/avatars/michael.jpg", role: "Senior Analyst" },
        { name: "Jamie Rodriguez", avatar: "/avatars/jamie.jpg", role: "Budget Manager" }
      ],
      status: "Active",
      progress: 65,
      dueDate: "Jul 15, 2025",
      activity: "High",
      tasks: { total: 24, completed: 16 }
    },
    {
      id: 2,
      name: "Annual Report Preparation",
      description: "Compilation and review of annual financial reports and statements",
      members: [
        { name: "Thomas Wilson", avatar: "/avatars/thomas.jpg", role: "Accounting Lead" },
        { name: "Aisha Johnson", avatar: "/avatars/aisha.jpg", role: "Financial Controller" },
        { name: "David Kim", avatar: "/avatars/david.jpg", role: "Compliance Officer" }
      ],
      status: "Active",
      progress: 42,
      dueDate: "Aug 30, 2025",
      activity: "Medium",
      tasks: { total: 32, completed: 14 }
    }
  ];

  return (
    <>
      <PremiumPageHeader
        title="Collaboration Hub"
        description="Coordinate financial activities and collaborate with your team"
        icon={<Users className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs defaultValue="projects" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Clipboard className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <List className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search projects..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {projects.map((project) => (
              <PremiumCard
                key={project.id}
                className="hover-lift"
                showAccent={true}
                accentColor="from-[#2D71A8] to-[#4D8EC3]"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <Badge className="bg-green-50 text-green-700">{project.status}</Badge>
                  </div>
                  
                  <p className="text-slate-600 mb-4">{project.description}</p>
                  
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Team Members</div>
                      <div className="flex -space-x-2">
                        {project.members.map((member, idx) => (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                            <AvatarFallback className="bg-slate-200 text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs border-2 border-white">
                          +{project.members.length > 3 ? project.members.length - 3 : 0}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium">Progress</div>
                        <div className="text-sm">{project.progress}%</div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3]"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-xs">Due Date</div>
                        <div className="font-medium">{project.dueDate}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-xs">Tasks</div>
                        <div className="font-medium">{project.tasks.completed}/{project.tasks.total}</div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-xs">Activity</div>
                        <div className="font-medium">{project.activity}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t border-slate-100">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="text-xs">Chat</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                      <List className="h-3.5 w-3.5" />
                      <span className="text-xs">Tasks</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-xs">Reports</span>
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            ))}
            
            <PremiumCard className="hover-lift border-dashed border-2 border-slate-200 bg-slate-50/50 flex items-center justify-center h-[440px]">
              <div className="text-center p-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <PlusCircle className="h-8 w-8 text-[#2D71A8]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Create New Project</h3>
                <p className="text-slate-500 mb-4">Start a new financial collaboration project with your team</p>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
        
        {/* Other tabs would go here */}
      </Tabs>
    </>
  );
};

export default Collaboration;