import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Clock, Settings2, MessageSquare, BarChart, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'financial_alert' | 'budget_alert' | 'approval_request' | 'comment' | 'system';
  priority: 'high' | 'medium' | 'low';
}

const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const { 
    isSupported, 
    isSubscribed, 
    requestPermission, 
    showTestNotification 
  } = useNotifications();
  
  const [notificationFrequency, setNotificationFrequency] = useState('immediate');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'budget_threshold',
      name: 'Budget Threshold Alerts',
      description: 'Receive alerts when expenses exceed budget thresholds',
      enabled: true,
      type: 'budget_alert',
      priority: 'high'
    },
    {
      id: 'cash_flow',
      name: 'Cash Flow Anomalies',
      description: 'Be notified of unexpected changes in cash flow projections',
      enabled: true,
      type: 'financial_alert',
      priority: 'high'
    },
    {
      id: 'approval_requests',
      name: 'Approval Requests',
      description: 'Notifications for pending approval requests',
      enabled: true,
      type: 'approval_request',
      priority: 'medium'
    },
    {
      id: 'comments',
      name: 'Comment Notifications',
      description: 'Be notified when someone comments on your reports or forecasts',
      enabled: false,
      type: 'comment',
      priority: 'low'
    },
    {
      id: 'forecast_updates',
      name: 'Forecast Updates',
      description: 'Receive notifications when financial forecasts are updated',
      enabled: true,
      type: 'financial_alert',
      priority: 'medium'
    }
  ]);
  
  const handleToggle = (id: string) => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };
  
  const handleEnableAll = () => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => ({ ...setting, enabled: true }))
    );
    
    if (!isSubscribed) {
      requestPermission();
    }
    
    toast({
      title: "All notifications enabled",
      description: "You'll now receive all notifications."
    });
  };
  
  const handleDisableAll = () => {
    setNotificationSettings(prevSettings => 
      prevSettings.map(setting => ({ ...setting, enabled: false }))
    );
    
    toast({
      title: "All notifications disabled",
      description: "You won't receive any notifications."
    });
  };
  
  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    
    if (granted) {
      // Show a test notification
      showTestNotification('Test Notification', {
        body: 'This is a test notification. Your notification settings are now active.',
        icon: '/favicon.ico'
      });
    }
  };
  
  const handleFrequencyChange = (value: string) => {
    setNotificationFrequency(value);
    
    toast({
      title: "Notification frequency updated",
      description: `Notifications will now be sent ${value}.`
    });
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'financial_alert':
        return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'budget_alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'approval_request':
        return <Clock className="h-4 w-4 text-indigo-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notification Settings</CardTitle>
            <Settings2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription>
            Configure how and when you receive financial alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notification permission */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isSubscribed ? (
                  <Bell className="h-6 w-6 text-primary" />
                ) : (
                  <BellOff className="h-6 w-6 text-muted-foreground" />
                )}
                <div>
                  <h3 className="text-sm font-medium">
                    {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSubscribed 
                      ? 'You will receive push notifications for important events' 
                      : 'Allow notifications to stay informed about important financial events'}
                  </p>
                </div>
              </div>
              
              <Button 
                size="sm" 
                onClick={handleRequestPermission}
                disabled={!isSupported || isSubscribed}
              >
                {isSubscribed ? 'Enabled' : 'Enable'}
              </Button>
            </div>
          </div>
          
          {/* Notification frequency */}
          <div className="mt-4">
            <Label className="text-sm">Notification Frequency</Label>
            <Select 
              value={notificationFrequency} 
              onValueChange={handleFrequencyChange}
              disabled={!isSupported || !isSubscribed}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator className="my-4" />
          
          {/* Notification settings list */}
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {getIconForType(setting.type)}
                    <Label className="ml-2 text-sm font-medium">{setting.name}</Label>
                  </div>
                  <p className="ml-6 text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <Switch 
                  checked={setting.enabled} 
                  onCheckedChange={() => handleToggle(setting.id)} 
                  disabled={!isSupported || !isSubscribed}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisableAll}
              disabled={!isSupported || !isSubscribed}
            >
              Disable All
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleEnableAll}
              disabled={!isSupported}
            >
              Enable All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;