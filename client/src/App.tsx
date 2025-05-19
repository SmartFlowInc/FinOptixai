import { Route, Switch } from "wouter";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Budgeting from "@/pages/Budgeting";
import Forecasting from "@/pages/Forecasting";
import Reports from "@/pages/Reports";
import Collaboration from "@/pages/Collaboration";
import DataSources from "@/pages/DataSources";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/budgeting" component={Budgeting} />
        <Route path="/forecasting" component={Forecasting} />
        <Route path="/reports" component={Reports} />
        <Route path="/collaboration" component={Collaboration} />
        <Route path="/data-sources" component={DataSources} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
