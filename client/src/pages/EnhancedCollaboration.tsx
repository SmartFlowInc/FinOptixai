import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import ThreadedComments from '@/components/collaboration/ThreadedComments';
import { AccessProvider, RoleMatrix, ProtectedComponent } from '@/components/collaboration/RoleBasedAccess';
import { 
  AlertCircle, 
  Calendar,
  FileText,
  Loader2, 
  LockIcon, 
  MessageSquare, 
  PenTool, 
  Puzzle, 
  Settings, 
  Share,
  Shield, 
  Users
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Component for the User Presence indicator
const CollaborativeUsers: React.FC = () => {
  const activeUsers = [
    { id: 1, name: 'John Doe', avatarUrl: '', status: 'editing', area: 'Q4 Budget' },
    { id: 2, name: 'Jane Smith', avatarUrl: '', status: 'viewing', area: 'Revenue Forecast' },
    { id: 3, name: 'Robert Johnson', avatarUrl: '', status: 'commenting', area: 'Q4 Budget' },
    { id: 4, name: 'Emily Williams', avatarUrl: '', status: 'viewing', area: 'Marketing Budget' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Active Collaborators</CardTitle>
        <CardDescription>
          Users currently working in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-green-500">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.area}</div>
                </div>
              </div>
              <Badge className={
                user.status === 'editing' 
                  ? 'bg-blue-100 text-blue-800' 
                  : user.status === 'commenting'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for the Shared Documents
const SharedDocuments: React.FC = () => {
  const documents = [
    { id: 1, title: 'Q4 2023 Budget Plan', type: 'spreadsheet', updatedAt: new Date('2023-09-15'), updatedBy: 'John Doe', status: 'final' },
    { id: 2, title: 'Marketing Campaign ROI Analysis', type: 'document', updatedAt: new Date('2023-09-14'), updatedBy: 'Jane Smith', status: 'draft' },
    { id: 3, title: 'Revenue Forecast 2024', type: 'spreadsheet', updatedAt: new Date('2023-09-13'), updatedBy: 'Robert Johnson', status: 'review' },
    { id: 4, title: 'Q3 Financial Review', type: 'presentation', updatedAt: new Date('2023-09-10'), updatedBy: 'Emily Williams', status: 'final' },
  ];

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'spreadsheet': return '📊';
      case 'document': return '📄';
      case 'presentation': return '📑';
      default: return '📁';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'final':
        return <Badge className="bg-green-100 text-green-800">Final</Badge>;
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800">Draft</Badge>;
      case 'review':
        return <Badge className="bg-purple-100 text-purple-800">In Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Shared Documents</CardTitle>
        <CardDescription>
          Recently updated financial documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center border-b pb-3 last:border-b-0 last:pb-0">
              <div className="text-2xl mr-3">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{doc.title}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Updated by {doc.updatedBy}</span>
                  <span className="mx-1">•</span>
                  <span>{doc.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                {getStatusBadge(doc.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for the Collaboration Activity
const CollaborationActivity: React.FC = () => {
  const activities = [
    { id: 1, user: 'John Doe', action: 'edited', target: 'Q4 Budget Plan', time: '10 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'commented on', target: 'Revenue Forecast', time: '30 minutes ago' },
    { id: 3, user: 'Robert Johnson', action: 'approved', target: 'Marketing Budget Change', time: '1 hour ago' },
    { id: 4, user: 'Emily Williams', action: 'created', target: 'New Expense Report', time: '2 hours ago' },
    { id: 5, user: 'Michael Brown', action: 'shared', target: 'Q3 Financial Analysis', time: '3 hours ago' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest collaborative actions in the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center text-sm">
              <div className="font-medium mr-1">{activity.user}</div>
              <div className="text-muted-foreground mr-1">{activity.action}</div>
              <div className="font-medium mr-1 text-primary">{activity.target}</div>
              <div className="text-muted-foreground text-xs ml-auto">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Project Status
const ProjectStatus: React.FC = () => {
  const projects = [
    { id: 1, name: 'Q4 Budget Planning', progress: 75, dueDate: new Date('2023-10-15'), owner: 'John Doe' },
    { id: 2, name: '2024 Financial Forecast', progress: 40, dueDate: new Date('2023-11-01'), owner: 'Jane Smith' },
    { id: 3, name: 'Department Budget Reviews', progress: 90, dueDate: new Date('2023-09-30'), owner: 'Robert Johnson' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Financial Project Status</CardTitle>
        <CardDescription>
          Track ongoing collaborative projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {projects.map(project => (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-muted-foreground">Due: {project.dueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <Progress value={project.progress} className="h-2" />
                <span className="text-sm font-medium w-10">{project.progress}%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Owner: {project.owner}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Collaboration page
const EnhancedCollaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Demo function for adding a comment
  const handleAddComment = (threadId: number, content: string, parentId?: number) => {
    toast({
      title: 'Comment Added',
      description: 'Your comment has been added to the discussion thread.',
    });
  };

  return (
    <AccessProvider initialRole='finance_manager'>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Collaborative Workspace</h1>
          <p className="text-neutral-600">
            Work together with your team on financial planning and analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Discussions</span>
            </TabsTrigger>
            <TabsTrigger value="realtime-editing" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              <span>Realtime Editing</span>
            </TabsTrigger>
            <TabsTrigger value="access-control" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Access Control</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CollaborativeUsers />
              <SharedDocuments />
              <CollaborationActivity />
              <ProjectStatus />
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="mt-6">
            <ThreadedComments 
              currentUser={{
                id: 1,
                name: 'John Doe',
                role: 'Finance Manager',
                isOnline: true
              }}
              onAddComment={handleAddComment}
            />
          </TabsContent>

          {/* Realtime Editing Tab */}
          <TabsContent value="realtime-editing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Collaborative Editing</CardTitle>
                <CardDescription>
                  Edit documents and spreadsheets together with your team in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="font-medium mb-1">Budget Spreadsheet</h3>
                      <p className="text-sm text-muted-foreground">Collaborative financial planning</p>
                      <div className="flex justify-center mt-4">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>J</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>R</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>E</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <Calendar className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="font-medium mb-1">Project Timeline</h3>
                      <p className="text-sm text-muted-foreground">Track financial milestones</p>
                      <div className="flex justify-center mt-4">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>M</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>J</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <Settings className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="font-medium mb-1">Financial Metrics</h3>
                      <p className="text-sm text-muted-foreground">Key performance indicators</p>
                      <div className="flex justify-center mt-4">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback>S</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">How Real-Time Collaboration Works</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <Users className="h-10 w-10 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Multiple Users</h4>
                      <p className="text-sm text-muted-foreground">
                        Multiple team members can work on the same document simultaneously
                      </p>
                    </div>
                    
                    <div>
                      <PenTool className="h-10 w-10 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Live Editing</h4>
                      <p className="text-sm text-muted-foreground">
                        See changes from your teammates in real-time as they happen
                      </p>
                    </div>
                    
                    <div>
                      <Share className="h-10 w-10 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Seamless Sharing</h4>
                      <p className="text-sm text-muted-foreground">
                        Share documents with specific teammates with custom permissions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button size="lg">
                    Start Collaborating
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access-control" className="mt-6">
            <ProtectedComponent
              requiredPermission={{ area: 'settings', action: 'view' }}
              fallback={
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>
                    You don't have permission to view the access control settings.
                    Please contact an administrator for assistance.
                  </AlertDescription>
                </Alert>
              }
            >
              <RoleMatrix />
            </ProtectedComponent>
          </TabsContent>
        </Tabs>
      </div>
    </AccessProvider>
  );
};

export default EnhancedCollaboration;