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
import LandingPage from "@/pages/LandingPage";
import SystemArchitecture from "@/pages/SystemArchitecture";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/system-architecture" component={SystemArchitecture} />
      <Route path="/dashboard">
        <Layout><Dashboard /></Layout>
      </Route>
      <Route path="/enhanced-dashboard">
        <Layout><Dashboard /></Layout>
      </Route>
      <Route path="/advanced-dashboard">
        <Layout><AdvancedDashboard /></Layout>
      </Route>
      <Route path="/budgeting">
        <Layout><Budgeting /></Layout>
      </Route>
      <Route path="/forecasting">
        <Layout><Forecasting /></Layout>
      </Route>
      <Route path="/reports">
        <Layout><Reports /></Layout>
      </Route>
      <Route path="/collaboration">
        <Layout><Collaboration /></Layout>
      </Route>
      <Route path="/data-sources">
        <Layout><DataSources /></Layout>
      </Route>
      <Route path="/data-integration">
        <Layout><DataIntegration /></Layout>
      </Route>
      <Route path="/enhanced-data-integration">
        <Layout><EnhancedDataIntegration /></Layout>
      </Route>
      <Route path="/continuous-improvement">
        <Layout><ContinuousImprovement /></Layout>
      </Route>
      <Route path="/anomaly-detection">
        <Layout><AnomalyDetection /></Layout>
      </Route>
      <Route path="/insights">
        <Layout><Insights /></Layout>
      </Route>
      <Route path="/workflow-approval">
        <Layout><WorkflowApproval /></Layout>
      </Route>
      <Route path="/enhanced-collaboration">
        <Layout><EnhancedCollaboration /></Layout>
      </Route>
      <Route path="/calendar">
        <Layout><Calendar /></Layout>
      </Route>
      <Route path="/settings">
        <Layout><Settings /></Layout>
      </Route>
      <Route path="/mobile-dashboard">
        <Layout><MobileDashboard /></Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
