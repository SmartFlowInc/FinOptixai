import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    weeklyReport: true,
    budgetAlerts: true,
    forecastUpdates: false,
    newActivity: true
  });
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  const { toast } = useToast();
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Your password has been changed."
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
    
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully."
    });
  };
  
  const handleSaveCompany = () => {
    toast({
      title: "Company settings updated",
      description: "Your company settings have been saved successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-500">Settings</h2>
        <p className="text-sm text-neutral-400">Manage your account preferences and configuration</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex justify-center sm:justify-start">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">
                        {user?.avatarInitials || "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={user?.fullName || "John Doe"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username || "john.doe"} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue={user?.jobTitle || "Financial Director"} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio"
                      className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                      defaultValue="Financial director with over 15 years of experience in corporate finance and strategic planning."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium mb-1">Two-factor authentication</h4>
                  <p className="text-sm text-neutral-400">Secure your account with 2FA</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium mb-1">Authentication app</h4>
                  <p className="text-sm text-neutral-400">Use an authentication app to generate one-time codes</p>
                </div>
                <Button variant="outline" size="sm">
                  Set up
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium mb-1">Recovery codes</h4>
                  <p className="text-sm text-neutral-400">Generate backup codes to use if you lose access to your authentication app</p>
                </div>
                <Button variant="outline" size="sm">
                  View codes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="ri-computer-line text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current session</p>
                      <p className="text-xs text-neutral-400">MacBook Pro • San Francisco, USA • Today at 10:32 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-xs text-neutral-500">Active now</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <i className="ri-smartphone-line text-neutral-500"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">iPhone 13</p>
                      <p className="text-xs text-neutral-400">San Francisco, USA • Yesterday at 2:15 PM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <i className="ri-computer-line text-neutral-500"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Windows PC</p>
                      <p className="text-xs text-neutral-400">New York, USA • Oct 10, 2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="text-red-500">
                Sign out of all sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Channels</h3>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-neutral-400">Receive email updates</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleToggleNotification('email')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Browser notifications</p>
                    <p className="text-xs text-neutral-400">Get alerts in the browser</p>
                  </div>
                  <Switch 
                    checked={notifications.browser}
                    onCheckedChange={() => handleToggleNotification('browser')}
                  />
                </div>
                
                <Separator />
                
                <h3 className="text-sm font-medium">Notification Types</h3>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Weekly financial reports</p>
                    <p className="text-xs text-neutral-400">Receive weekly summary reports</p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyReport}
                    onCheckedChange={() => handleToggleNotification('weeklyReport')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Budget alerts</p>
                    <p className="text-xs text-neutral-400">Get notified when budget thresholds are exceeded</p>
                  </div>
                  <Switch 
                    checked={notifications.budgetAlerts}
                    onCheckedChange={() => handleToggleNotification('budgetAlerts')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Forecast updates</p>
                    <p className="text-xs text-neutral-400">Notifications when forecasts are updated</p>
                  </div>
                  <Switch 
                    checked={notifications.forecastUpdates}
                    onCheckedChange={() => handleToggleNotification('forecastUpdates')}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Team activity</p>
                    <p className="text-xs text-neutral-400">Get notified about team comments and updates</p>
                  </div>
                  <Switch 
                    checked={notifications.newActivity}
                    onCheckedChange={() => handleToggleNotification('newActivity')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select defaultValue="50-200">
                      <SelectTrigger id="companySize">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="50-200">50-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year</Label>
                    <Select defaultValue="jan-dec">
                      <SelectTrigger id="fiscalYear">
                        <SelectValue placeholder="Select fiscal year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jan-dec">January - December</SelectItem>
                        <SelectItem value="feb-jan">February - January</SelectItem>
                        <SelectItem value="apr-mar">April - March</SelectItem>
                        <SelectItem value="jul-jun">July - June</SelectItem>
                        <SelectItem value="oct-sep">October - September</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input id="companyAddress" defaultValue="123 Main Street, Suite 100" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" defaultValue="California" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal/Zip Code</Label>
                    <Input id="zipCode" defaultValue="94105" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select defaultValue="us">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveCompany}>Save Company Information</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage departments for financial planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="ri-shopping-bag-line text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Marketing</p>
                      <p className="text-xs text-neutral-400">12 members • 4 budgets</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <i className="ri-user-line text-secondary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sales</p>
                      <p className="text-xs text-neutral-400">18 members • 5 budgets</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <i className="ri-settings-5-line text-accent"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Operations</p>
                      <p className="text-xs text-neutral-400">8 members • 3 budgets</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <i className="ri-flask-line text-warning"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">R&D</p>
                      <p className="text-xs text-neutral-400">6 members • 2 budgets</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button>
                  <i className="ri-add-line mr-2"></i>
                  Add Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                        Current Plan
                      </div>
                      <h3 className="text-lg font-semibold">Enterprise Plan</h3>
                      <p className="text-neutral-400 text-sm mt-1">Billed annually • $499/month</p>
                    </div>
                    <Button size="sm">Manage Plan</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-primary"></i>
                      <span className="text-sm">Unlimited users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-primary"></i>
                      <span className="text-sm">Advanced forecasting tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-primary"></i>
                      <span className="text-sm">Custom reporting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-primary"></i>
                      <span className="text-sm">API access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-primary"></i>
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-base font-medium">Payment Information</h3>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <i className="ri-visa-line text-xl text-neutral-500"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-neutral-400">Expires 04/2025</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <i className="ri-add-line mr-2"></i>
                    Add Payment Method
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-base font-medium">Billing History</h3>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Invoice #12345</p>
                      <p className="text-xs text-neutral-400">Oct 1, 2023 • $499.00</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="ri-download-2-line mr-1"></i>
                      PDF
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Invoice #12344</p>
                      <p className="text-xs text-neutral-400">Sep 1, 2023 • $499.00</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="ri-download-2-line mr-1"></i>
                      PDF
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Invoice #12343</p>
                      <p className="text-xs text-neutral-400">Aug 1, 2023 • $499.00</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="ri-download-2-line mr-1"></i>
                      PDF
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-medium">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-primary rounded-lg p-3 flex flex-col items-center">
                    <div className="h-24 w-full mb-3 bg-white rounded overflow-hidden">
                      <div className="h-6 bg-primary"></div>
                      <div className="flex h-18">
                        <div className="w-1/4 bg-neutral-100"></div>
                        <div className="w-3/4 p-2">
                          <div className="h-2 w-3/4 bg-neutral-200 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">Light Mode</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Active
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-lg p-3 flex flex-col items-center">
                    <div className="h-24 w-full mb-3 bg-neutral-900 rounded overflow-hidden">
                      <div className="h-6 bg-primary"></div>
                      <div className="flex h-18">
                        <div className="w-1/4 bg-neutral-800"></div>
                        <div className="w-3/4 p-2">
                          <div className="h-2 w-3/4 bg-neutral-700 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-neutral-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-lg p-3 flex flex-col items-center">
                    <div className="h-24 w-full mb-3 bg-white rounded overflow-hidden">
                      <div className="h-6 bg-[#0066CC]"></div>
                      <div className="flex h-18">
                        <div className="w-1/4 bg-neutral-100"></div>
                        <div className="w-3/4 p-2">
                          <div className="h-2 w-3/4 bg-neutral-200 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-neutral-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">System Default</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-base font-medium">Dashboard Layout</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Compact view</p>
                      <p className="text-xs text-neutral-400">Show more data with a compact layout</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Wide layout</p>
                      <p className="text-xs text-neutral-400">Use full screen width for the dashboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-base font-medium">Sidebar Position</h3>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="left" name="sidebar" className="h-4 w-4 text-primary" defaultChecked />
                    <Label htmlFor="left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="right" name="sidebar" className="h-4 w-4 text-primary" />
                    <Label htmlFor="right">Right</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
