import React from "react";
import FeedbackSystem from "@/components/continuous-improvement/FeedbackSystem";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ListChecks,
  BarChart,
  TrendingUp,
  Users,
  MessageSquare,
  Lightbulb,
  Settings,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Clock,
  RefreshCw,
  ChevronRight,
  LineChart,
  Activity
} from "lucide-react";

const ContinuousImprovement = () => {
  // Sample stats for the premium header
  const headerStats = [
    {
      title: "Active Initiatives",
      value: "8",
      icon: <ListChecks className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Overall Progress",
      value: "76%",
      icon: <BarChart className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Improvement Rate",
      value: "+12.3%",
      icon: <TrendingUp className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Team Members",
      value: "14",
      icon: <Users className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Settings className="mr-2 h-4 w-4" />
        Configure
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        New Initiative
      </Button>
    </>
  );

  return (
    <>
      <PremiumPageHeader
        title="Continuous Improvement"
        description="Track feedback, measure process improvements, and drive adaptive learning"
        icon={<Activity className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs defaultValue="initiatives" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="initiatives" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ListChecks className="h-4 w-4 mr-2" />
            Initiatives
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <BarChart className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="learning" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Initiatives Tab */}
        <TabsContent value="initiatives" className="mt-6">
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Active Initiatives</h3>
                  <p className="text-sm text-slate-500">Process improvement and optimization initiatives</p>
                </div>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  New Initiative
                </Button>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="text-center text-slate-400 py-10">
                <ListChecks className="h-12 w-12 mx-auto mb-2" />
                <p>Initiatives would be displayed here</p>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Other tab contents would go here */}
      </Tabs>
      
      {/* Original component, we'll hide this for now */}
      <div className="hidden">
        <FeedbackSystem />
      </div>
    </>
  );
};

export default ContinuousImprovement;