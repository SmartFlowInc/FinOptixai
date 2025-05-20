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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Cloud,
  ExternalLink,
  Clipboard,
  Database,
  Eye,
  EyeOff,
  RefreshCw,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

export const Settings = () => {
  const [profileTab, setProfileTab] = useState<string>("personal");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
  
  const handleUpdatePassword = () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call success
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
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
  
  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your data export is being prepared and will be available shortly.",
    });
  };
  
  const handleDeleteAccount = () => {
    toast({
      title: "Request Submitted",
      description: "Your account deletion request has been submitted for review.",
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
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                            <Clipboard className="h-4 w-4" />
                            <span className="text-xs">Copy</span>
                          </Button>
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
                        
                        <Separator />
                        
                        <h4 className="font-medium">Regional Settings</h4>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Language</h5>
                            <p className="text-xs text-slate-500">Interface language</p>
                          </div>
                          <Select defaultValue="en-US">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en-US">English (US)</SelectItem>
                              <SelectItem value="en-GB">English (UK)</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Timezone</h5>
                            <p className="text-xs text-slate-500">Your current timezone</p>
                          </div>
                          <Select defaultValue="America/New_York">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Date Format</h5>
                            <p className="text-xs text-slate-500">How dates are displayed</p>
                          </div>
                          <Select defaultValue="MM/DD/YYYY">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <h5 className="font-medium text-sm">Currency</h5>
                            <p className="text-xs text-slate-500">Primary currency display</p>
                          </div>
                          <Select defaultValue="USD">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                              <SelectItem value="CAD">CAD ($)</SelectItem>
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
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </PremiumCard>
              
              <PremiumCard 
                className="hover-lift"
                showAccent={true}
                accentColor="from-red-500 to-red-600"
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Danger Zone</h3>
                      <p className="text-sm text-slate-500">Account management</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <h4 className="font-medium">Export Your Data</h4>
                    <p className="text-sm text-slate-500 mb-3">Download a copy of all your account data</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-[#2D71A8] text-[#2D71A8]"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Request Data Export
                    </Button>
                  </div>
                  
                  <div className="p-3 border border-red-200 rounded-lg bg-red-50/30">
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-slate-600 mb-3">Permanently delete your account and all data</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete your account?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-slate-500 mb-4">
                            Please type <strong>delete my account</strong> to confirm.
                          </p>
                          <Input placeholder="delete my account" className="mb-2" />
                          <p className="text-xs text-red-500">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            This action is permanent and cannot be recovered.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Password</h3>
                      <p className="text-sm text-slate-500">Update your password</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          type={showPassword ? "text" : "password"} 
                          value={passwordInfo.currentPassword} 
                          onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input 
                          id="newPassword" 
                          type={showPassword ? "text" : "password"} 
                          value={passwordInfo.newPassword} 
                          onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input 
                          id="confirmPassword" 
                          type={showPassword ? "text" : "password"} 
                          value={passwordInfo.confirmPassword} 
                          onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-medium">Password Requirements:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          <span>Minimum 8 characters</span>
                        </li>
                        <li className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          <span>At least one uppercase letter</span>
                        </li>
                        <li className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          <span>At least one number</span>
                        </li>
                        <li className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          <span>At least one special character</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A]" onClick={handleUpdatePassword}>Update Password</Button>
                  </div>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Multi-Factor Authentication</h3>
                      <p className="text-sm text-slate-500">Secure your account with 2FA</p>
                    </div>
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Enabled</Badge>
                  </div>
                }
              >
                <div className="space-y-5">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium mb-1">Authenticator App</h4>
                        <p className="text-sm text-slate-500 mb-2">
                          Use an authenticator app like Google Authenticator or Authy to get verification codes.
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Primary</Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                              <RefreshCw className="h-3.5 w-3.5 mr-1" />
                              Reconfigure
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-[#2D71A8]" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium mb-1">Email Authentication</h4>
                        <p className="text-sm text-slate-500 mb-2">
                          Receive verification codes via email at j***@company.com
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-50">Secondary</Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-dashed p-4 bg-slate-50">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Key className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium mb-1">Security Key</h4>
                        <p className="text-sm text-slate-500 mb-2">
                          Use a hardware security key like a YubiKey or Titan Security Key.
                        </p>
                        <Button variant="outline" size="sm" className="h-8">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Security Key
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
            
            <div>
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Security Status</h3>
                      <p className="text-sm text-slate-500">Account protection level</p>
                    </div>
                  </div>
                }
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Security Score</h4>
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Strong</Badge>
                  </div>
                  
                  <div className="w-full h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      <span>Strong password</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      <span>Two-factor authentication enabled</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      <span>Recent login history reviewed</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <X className="h-4 w-4 mr-2 text-slate-400" />
                      <span>Recovery phone number not set</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">
                    <Shield className="mr-2 h-4 w-4" />
                    View Security Recommendations
                  </Button>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Connected Sessions</h3>
                      <p className="text-sm text-slate-500">Currently active devices</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-blue-50/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="rounded-full h-8 w-8 bg-blue-100 flex items-center justify-center mr-3">
                          <Globe className="h-4 w-4 text-[#2D71A8]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Chrome on MacOS</h4>
                          <p className="text-xs text-slate-500">New York, USA • Current session</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-50 text-[#2D71A8] hover:bg-blue-50">Active</Badge>
                    </div>
                    <div className="text-xs text-slate-500">Last active: Just now</div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="rounded-full h-8 w-8 bg-slate-100 flex items-center justify-center mr-3">
                          <Globe className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Safari on iPhone</h4>
                          <p className="text-xs text-slate-500">New York, USA</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="xs" className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="h-3 w-3 mr-1" />
                        Sign out
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500">Last active: 2 hours ago</div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="rounded-full h-8 w-8 bg-slate-100 flex items-center justify-center mr-3">
                          <Globe className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Edge on Windows</h4>
                          <p className="text-xs text-slate-500">Chicago, USA</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="xs" className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="h-3 w-3 mr-1" />
                        Sign out
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500">Last active: Yesterday at 3:42 PM</div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out All Other Devices
                  </Button>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <PremiumCard
            className="hover-lift" 
            showAccent={true}
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-slate-500">Manage how you receive notifications</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="border-[#2D71A8] text-[#2D71A8]"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Test Notifications
                  </Button>
                </div>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 sm:mb-0">Notification Channels</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="emailAlerts" 
                        checked={notificationSettings.emailAlerts} 
                        onCheckedChange={() => handleToggleNotification("emailAlerts")}
                      />
                      <Label htmlFor="emailAlerts" className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="smsAlerts" 
                        checked={notificationSettings.smsAlerts} 
                        onCheckedChange={() => handleToggleNotification("smsAlerts")}
                      />
                      <Label htmlFor="smsAlerts" className="text-sm">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="browserNotifications" 
                        checked={notificationSettings.browserNotifications} 
                        onCheckedChange={() => handleToggleNotification("browserNotifications")}
                      />
                      <Label htmlFor="browserNotifications" className="text-sm">Browser</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-5">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h5 className="font-medium text-sm">Report Completion</h5>
                      <p className="text-xs text-slate-500">Notifications when reports are generated or completed</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.reportCompletion} 
                      onCheckedChange={() => handleToggleNotification("reportCompletion")}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h5 className="font-medium text-sm">Budget Approvals</h5>
                      <p className="text-xs text-slate-500">Updates on budget approval requests and decisions</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.budgetApprovals} 
                      onCheckedChange={() => handleToggleNotification("budgetApprovals")}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h5 className="font-medium text-sm">Forecast Updates</h5>
                      <p className="text-xs text-slate-500">Changes and updates to financial forecasts</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.forecastUpdates} 
                      onCheckedChange={() => handleToggleNotification("forecastUpdates")}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h5 className="font-medium text-sm">Security Alerts</h5>
                      <p className="text-xs text-slate-500">Critical security notifications and alerts</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts} 
                      onCheckedChange={() => handleToggleNotification("securityAlerts")}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h5 className="font-medium text-sm">Data Connectivity</h5>
                      <p className="text-xs text-slate-500">Alerts for data source connection issues</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.dataConnectivity} 
                      onCheckedChange={() => handleToggleNotification("dataConnectivity")}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Notification frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Send all notifications immediately</SelectItem>
                    <SelectItem value="digest">Send daily digest</SelectItem>
                    <SelectItem value="weekly">Send weekly summary</SelectItem>
                    <SelectItem value="important">Only send important notifications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] shadow-md text-white">
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Current Plan</h3>
                      <p className="text-sm text-slate-500">Your subscription details</p>
                    </div>
                    <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50">Enterprise</Badge>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#2D71A8]/10 to-purple-500/10 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">Enterprise Plan</h3>
                        <p className="text-slate-600">Team and organization-wide financial analytics</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">$799<span className="text-sm font-normal text-slate-500">/month</span></div>
                        <p className="text-sm text-slate-500">Billed annually</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-4 pt-2 border-t border-slate-200">
                      <div className="text-slate-600">Current billing period</div>
                      <div className="font-medium">May 15, 2024 - May 14, 2025</div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-4">
                      <div className="text-slate-600">Users</div>
                      <div className="font-medium">50 of 50 seats used</div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="text-slate-600">Next payment</div>
                      <div className="font-medium">May 15, 2025 ($9,588.00)</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Enterprise Plan Features</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Unlimited data sources</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Advanced forecasting tools</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Custom report templates</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Role-based access control</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">AI-powered insights</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">24/7 priority support</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Unlimited data storage</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                        <span className="text-sm">Custom API integrations</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
                      <FileText className="mr-2 h-4 w-4" />
                      View Plan Details
                    </Button>
                    <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Team Seats
                    </Button>
                  </div>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Payment Methods</h3>
                      <p className="text-sm text-slate-500">Manage your billing information</p>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="border-[#2D71A8] text-[#2D71A8]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center mr-4">
                          <CreditCard className="h-5 w-5 text-[#2D71A8]" />
                        </div>
                        <div>
                          <div className="font-medium">Corporate Card</div>
                          <div className="text-sm text-slate-500">Visa ending in 4892</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-50 text-[#2D71A8] hover:bg-blue-50">Primary</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <div className="text-sm text-slate-500">Expires 05/2027</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <X className="h-3.5 w-3.5" />
                          <span className="text-xs">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center mr-4">
                          <Wallet className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-medium">ACH Transfer</div>
                          <div className="text-sm text-slate-500">Bank account ending in 9012</div>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Backup</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <div className="text-sm text-slate-500">Added on Mar 12, 2023</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <X className="h-3.5 w-3.5" />
                          <span className="text-xs">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
            
            <div>
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Billing Summary</h3>
                      <p className="text-sm text-slate-500">Current billing period</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Annual subscription</div>
                    <div className="font-medium">$9,588.00</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">50 user seats ($191.76/seat)</div>
                    <div className="font-medium">$9,588.00</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Enterprise support</div>
                    <div className="font-medium">Included</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">API Access</div>
                    <div className="font-medium">Included</div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="font-medium">Total billed annually</div>
                    <div className="font-bold">$9,588.00</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t flex justify-center">
                  <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Latest Invoice
                  </Button>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Billing History</h3>
                      <p className="text-sm text-slate-500">Past invoices and payments</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <h4 className="font-medium text-sm">May 15, 2023</h4>
                      <p className="text-xs text-slate-500">Invoice #INV-9901</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$9,588.00</div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <h4 className="font-medium text-sm">May 15, 2022</h4>
                      <p className="text-xs text-slate-500">Invoice #INV-8801</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$8,988.00</div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Paid</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div>
                      <h4 className="font-medium text-sm">May 15, 2021</h4>
                      <p className="text-xs text-slate-500">Invoice #INV-7701</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$8,388.00</div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Paid</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <Button variant="outline" className="w-full text-[#2D71A8] border-[#2D71A8]">
                    View All Invoices
                  </Button>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
        
        {/* Data Management Tab */}
        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Connected Data Sources</h3>
                      <p className="text-sm text-slate-500">Manage your data integrations</p>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="border-[#2D71A8] text-[#2D71A8]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Connection
                    </Button>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white mr-4">
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">SAP ERP Integration</div>
                          <div className="text-sm text-slate-500">Financial and operational data</div>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center text-white mr-4">
                          <Cloud className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Salesforce CRM</div>
                          <div className="text-sm text-slate-500">Sales pipeline and revenue data</div>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-green-500 flex items-center justify-center text-white mr-4">
                          <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">QuickBooks</div>
                          <div className="text-sm text-slate-500">Accounting and transaction data</div>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-amber-500 flex items-center justify-center text-white mr-4">
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Oracle Financial Cloud</div>
                          <div className="text-sm text-slate-500">Enterprise financial data</div>
                        </div>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Connecting</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-slate-500 flex items-center justify-center text-white mr-4">
                          <Database className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Custom SQL Database</div>
                          <div className="text-sm text-slate-500">Internal operational metrics</div>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Disabled</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh All Connections
                    </Button>
                  </div>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Data Retention</h3>
                      <p className="text-sm text-slate-500">Configure data storage and archiving</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-5">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="retention-item-1">
                      <AccordionTrigger className="text-base font-medium">Financial Data Retention</AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <Label htmlFor="financeRetention">Retain financial data for</Label>
                          <Select defaultValue="7">
                            <SelectTrigger id="financeRetention">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 year</SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                              <SelectItem value="7">7 years</SelectItem>
                              <SelectItem value="10">10 years</SelectItem>
                              <SelectItem value="forever">Indefinitely</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 pt-1">
                            Financial data is retained for 7 years by default to comply with standard recordkeeping requirements.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="retention-item-2">
                      <AccordionTrigger className="text-base font-medium">Analytics Data Retention</AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <Label htmlFor="analyticsRetention">Retain analytics data for</Label>
                          <Select defaultValue="3">
                            <SelectTrigger id="analyticsRetention">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 year</SelectItem>
                              <SelectItem value="2">2 years</SelectItem>
                              <SelectItem value="3">3 years</SelectItem>
                              <SelectItem value="5">5 years</SelectItem>
                              <SelectItem value="forever">Indefinitely</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 pt-1">
                            Analytics and reporting data is retained for 3 years by default.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="retention-item-3">
                      <AccordionTrigger className="text-base font-medium">Archived Data Access</AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="archiveAccess" defaultChecked />
                          <Label htmlFor="archiveAccess">Enable access to archived data</Label>
                        </div>
                        <p className="text-xs text-slate-500">
                          When enabled, users with appropriate permissions can access archived data through the Archive section.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="pt-2">
                    <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                      Save Retention Settings
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            </div>
            
            <div>
              <PremiumCard
                className="hover-lift mb-6" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Data Usage</h3>
                      <p className="text-sm text-slate-500">Storage and API quota</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Storage Usage</div>
                      <div className="text-sm">82.7 GB of 1 TB</div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] rounded-full" style={{ width: '8.27%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">API Requests (This Month)</div>
                      <div className="text-sm">1.3M of 5M</div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">Simultaneous Users</div>
                      <div className="text-sm">32 of 50</div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full text-[#2D71A8] border-[#2D71A8]">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Usage Reports
                    </Button>
                  </div>
                </div>
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">API Access</h3>
                      <p className="text-sm text-slate-500">Manage API keys and access</p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Production API Key</div>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded mb-3">
                      <div className="text-sm font-mono text-slate-500">•••••••••••••••••••••••••••</div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">Show</span>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-[#2D71A8] border-[#2D71A8]">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Regenerate</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Clipboard className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">Development API Key</div>
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">Limited Access</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded mb-3">
                      <div className="text-sm font-mono text-slate-500">•••••••••••••••••••••••••••</div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">Show</span>
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-[#2D71A8] border-[#2D71A8]">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Regenerate</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Clipboard className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2 text-[#2D71A8] border-[#2D71A8]">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View API Documentation
                  </Button>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;