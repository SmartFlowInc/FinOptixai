import { Route, Switch } from "wouter";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import AdvancedDashboard from "@/pages/AdvancedDashboard";
import Budgeting from "@/pages/Budgeting";
import Forecasting from "@/pages/Forecasting";
import Reports from "@/pages/Reports";
import Collaboration from "@/pages/Collaboration";
import EnhancedCollaboration from "@/pages/EnhancedCollaboration";
import DataSources from "@/pages/DataSources";
import DataIntegration from "@/pages/DataIntegration";
import EnhancedDataIntegration from "@/pages/EnhancedDataIntegration";
import ContinuousImprovement from "@/pages/ContinuousImprovement";
import AnomalyDetection from "@/pages/AnomalyDetection";
import Insights from "@/pages/Insights";
import WorkflowApproval from "@/pages/WorkflowApproval";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import MobileDashboard from "@/pages/MobileDashboard";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={EnhancedDashboard} />
        <Route path="/classic-dashboard" component={Dashboard} />
        <Route path="/advanced-dashboard" component={AdvancedDashboard} />
        <Route path="/budgeting" component={Budgeting} />
        <Route path="/forecasting" component={Forecasting} />
        <Route path="/reports" component={Reports} />
        <Route path="/collaboration" component={Collaboration} />
        <Route path="/data-sources" component={DataSources} />
        <Route path="/data-integration" component={DataIntegration} />
        <Route path="/enhanced-data-integration" component={EnhancedDataIntegration} />
        <Route path="/continuous-improvement" component={ContinuousImprovement} />
        <Route path="/anomaly-detection" component={AnomalyDetection} />
        <Route path="/insights" component={Insights} />
        <Route path="/workflow-approval" component={WorkflowApproval} />
        <Route path="/enhanced-collaboration" component={EnhancedCollaboration} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/settings" component={Settings} />
        <Route path="/mobile-dashboard" component={MobileDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
