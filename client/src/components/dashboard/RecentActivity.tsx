import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@shared/schema";

interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading = false }) => {
  const [filter, setFilter] = useState<'All' | 'Updates' | 'Comments'>('All');
  
  const filteredActivities = activities.filter(activity => {
    if (filter === 'All') return true;
    if (filter === 'Updates') return activity.action === 'updated_forecast' || activity.action === 'created_model';
    if (filter === 'Comments') return activity.action === 'commented';
    return true;
  });
  
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
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Recent Activity</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'All' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setFilter('All')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            All
          </Button>
          <Button 
            variant={filter === 'Updates' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setFilter('Updates')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            Updates
          </Button>
          <Button 
            variant={filter === 'Comments' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setFilter('Comments')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            Comments
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-neutral-400">Loading activity data...</p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {filteredActivities.map((activity, index) => (
                <div className="flex" key={activity.id}>
                  <div className="mr-4 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-500">
                        {activity.userId === 1 ? "JD" : "UK"}
                      </span>
                    </div>
                    {index < filteredActivities.length - 1 && (
                      <div className="w-px h-full bg-neutral-200 my-2"></div>
                    )}
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
            
            <Button variant="ghost" className="w-full mt-5 text-primary">
              <span>View More Activity</span>
              <i className="ri-arrow-down-s-line ml-1"></i>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
