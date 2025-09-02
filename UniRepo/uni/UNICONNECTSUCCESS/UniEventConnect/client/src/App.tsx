import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/welcome";
import StudentLogin from "@/pages/student-login";
import StudentSignup from "@/pages/student-signup";
import CollegeLogin from "@/pages/college-login";
import CollegeSignup from "@/pages/college-signup";
import StudentDashboard from "@/pages/student-dashboard";
import StudentProfile from "@/pages/student-profile";
import CollegeDashboard from "@/pages/college-dashboard";
import CollegeEvents from "@/pages/college-events";
import CreateEvent from "@/pages/create-event";
import EditEvent from "@/pages/edit-event";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/student/login" component={StudentLogin} />
      <Route path="/student/signup" component={StudentSignup} />
      <Route path="/college/login" component={CollegeLogin} />
      <Route path="/college/signup" component={CollegeSignup} />
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/profile" component={StudentProfile} />
      <Route path="/college/dashboard" component={CollegeDashboard} />
      <Route path="/college/events" component={CollegeEvents} />
      <Route path="/college/create-event" component={CreateEvent} />
      <Route path="/college/edit-event/:id" component={EditEvent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
