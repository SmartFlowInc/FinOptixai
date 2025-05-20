import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Bell, 
  Building, 
  Calendar, 
  Check, 
  ChevronRight, 
  Clock, 
  CreditCard, 
  Download, 
  FileText, 
  Globe, 
  HelpCircle, 
  Key, 
  Lock, 
  LogOut, 
  Mail, 
  Phone, 
  Plus, 
  Save, 
  Settings as SettingsIcon, 
  Shield, 
  User, 
  Users,
  Pencil,
  X,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

export const Settings = () => {
  const [profileTab, setProfileTab] = useState<string>("personal");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    title: "Financial Director",
    department: "Finance",
    location: "New York, USA"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    browserNotifications: true,
    reportCompletion: true,
    budgetApprovals: true,
    forecastUpdates: true,
    securityAlerts: true,
    dataConnectivity: true
  });
  
  const handleToggleEditing = () => {
    if (isEditing) {
      // Save changes
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleToggleNotification = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    
    toast({
      title: "Notification Settings Updated",
      description: `${key} notifications ${notificationSettings[key as keyof typeof notificationSettings] ? 'disabled' : 'enabled'}.`,
    });
  };

  // Define stats for the premium header
  const headerStats = [
    {
      title: "Account Status",
      value: "Active",
      icon: <Shield className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Member Since",
      value: "Mar 2023",
      icon: <Calendar className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Last Login",
      value: "5 hours ago",
      icon: <Clock className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Plan",
      value: "Enterprise",
      icon: <CreditCard className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <HelpCircle className="mr-2 h-4 w-4" />
        Help Center
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </>
  );

  return (
    <>
      <PremiumPageHeader
        title="Account Settings"
        description="Manage your profile, security, and preferences"
        icon={<SettingsIcon className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />
      
      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Database className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs value={profileTab} onValueChange={setProfileTab}>
                <TabsList className="bg-slate-100/50 p-1 rounded-lg w-full mb-6">
                  <TabsTrigger value="personal" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
                    Company Details
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
                    Preferences
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <PremiumCard 
                    className="hover-lift"
                    showAccent={true}
                    headerContent={
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-lg font-semibold">Personal Information</h3>
                          <p className="text-sm text-slate-500">Update your personal details</p>
                        </div>
                        <Button 
                          variant={isEditing ? "default" : "outline"}
                          size="sm" 
                          onClick={handleToggleEditing}
                          className={isEditing 
                            ? "bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md" 
                            : "border-[#2D71A8] text-[#2D71A8]"
                          }
                        >
                          {isEditing ? (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          ) : (
                            <>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </>
                          )}
                        </Button>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={personalInfo.firstName} 
                            onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={personalInfo.lastName} 
                            onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={personalInfo.email} 
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={personalInfo.phone} 
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title" 
                          value={personalInfo.title} 
                          onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select 
                            value={personalInfo.department} 
                            onValueChange={(value) => setPersonalInfo({...personalInfo, department: value})}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="HR">HR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={personalInfo.location} 
                            onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </PremiumCard>
                </TabsContent>
                
                <TabsContent value="company">
                  <PremiumCard 
                    className="hover-lift"
                    showAccent={true}
                    headerContent={
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-lg font-semibold">Company Information</h3>
                          <p className="text-sm text-slate-500">Your organization details</p>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="border-[#2D71A8] text-[#2D71A8]"
                        >
                          <Building className="h-4 w-4 mr-2" />
                          View Organization
                        </Button>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
                          <Building className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Acme Corporation</h3>
                          <p className="text-sm text-slate-500">Enterprise plan • 50 users</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">Company ID</h4>
                            <p className="text-sm text-slate-500">AC-12345-XYZ</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">Organization Admin</h4>
                            <p className="text-sm text-slate-500">Sarah Johnson (sarah.j@acme.com)</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                            <Mail className="h-4 w-4" />
                            <span className="text-xs">Contact</span>
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">Billing Address</h4>
                            <p className="text-sm text-slate-500">123 Corporate Plaza, New York, NY 10001</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                            <span className="text-xs">Edit</span>
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">Tax ID / VAT Number</h4>
                            <p className="text-sm text-slate-500">US 98-7654321</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                            <Pencil className="h-4 w-4" />
                            <span className="text-xs">Edit</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Team Members
                        </Button>
                      </div>
                    </div>
                  </PremiumCard>
                </TabsContent>
                
                <TabsContent value="preferences">
                  <PremiumCard 
                    className="hover-lift"
                    showAccent={true}
                    headerContent={
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h3 className="text-lg font-semibold">User Preferences</h3>
                          <p className="text-sm text-slate-500">Customize your experience</p>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="border-[#2D71A8] text-[#2D71A8]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Display Settings</h4>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Theme</h5>
                            <p className="text-xs text-slate-500">Choose your interface theme</p>
                          </div>
                          <Select defaultValue="light">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Dashboard Layout</h5>
                            <p className="text-xs text-slate-500">Default dashboard view</p>
                          </div>
                          <Select defaultValue="default">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="expanded">Expanded</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </PremiumCard>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <PremiumCard 
                className="hover-lift mb-6"
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Profile</h3>
                      <p className="text-sm text-slate-500">Your public profile</p>
                    </div>
                  </div>
                }
              >
                <div className="flex flex-col items-center gap-4 p-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] text-white text-xl">JD</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">John Doe</h3>
                    <p className="text-sm text-slate-500">Financial Director</p>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-blue-50 text-[#2D71A8] hover:bg-blue-100">Finance</Badge>
                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">Enterprise</Badge>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-500">Member since</div>
                      <div className="text-sm">March 15, 2023</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-500">Last login</div>
                      <div className="text-sm">Today, 10:42 AM</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-500">Status</div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-100">Active</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
        
        {/* Other tabs would go here, but simplified for this example */}
        <TabsContent value="security">
          <PremiumCard className="hover-lift" showAccent={true}>
            <div className="p-8 text-center">
              <Lock className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security Settings</h3>
              <p className="text-slate-600 mb-4">Manage your account security, passwords, and authentication methods.</p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                View Security Settings
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="notifications">
          <PremiumCard className="hover-lift" showAccent={true}>
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Notification Preferences</h3>
              <p className="text-slate-600 mb-4">Customize how and when you receive notifications.</p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                Manage Notifications
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="billing">
          <PremiumCard className="hover-lift" showAccent={true}>
            <div className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Billing Information</h3>
              <p className="text-slate-600 mb-4">Manage your subscription, payment methods, and billing history.</p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                View Billing Details
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="data">
          <PremiumCard className="hover-lift" showAccent={true}>
            <div className="p-8 text-center">
              <Database className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Management</h3>
              <p className="text-slate-600 mb-4">Manage your data connections, integrations, and export options.</p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                Manage Data Settings
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;