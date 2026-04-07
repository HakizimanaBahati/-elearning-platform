import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import MyCertificates from "./pages/MyCertificates";
import PaymentPage from "./pages/PaymentPage";
import UserProfile from "./pages/UserProfile";
import InstructorStudents from "./pages/InstructorStudents";
import AdminUsers from "./pages/AdminUsers";
import AdminCourseModeration from "./pages/AdminCourseModeration";
import AdminPayments from "./pages/AdminPayments";
import AdminSettings from "./pages/AdminSettings";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/courses"} component={CourseCatalog} />
      <Route path={"/courses/:id"} component={CourseDetail} />
      <Route path={"/lessons/:id"} component={LessonPlayer} />
      <Route path={"/payment/:courseId"} component={PaymentPage} />
      
      {/* Student Routes */}
      {user && (user.role === "user" || user.role === "admin") && (
        <>
          <Route path={"/dashboard"} component={StudentDashboard} />
          <Route path={"/certificates"} component={MyCertificates} />
          <Route path={"/profile"} component={UserProfile} />
        </>
      )}

      {/* Instructor Routes */}
      {user && (user.role === "instructor" || user.role === "admin") && (
        <>
          <Route path={"/instructor/dashboard"} component={InstructorDashboard} />
          <Route path={"/instructor/courses/create"} component={CreateCourse} />
          <Route path={"/instructor/courses/:id/edit"} component={EditCourse} />
          <Route path={"/instructor/courses/:courseId/students"} component={InstructorStudents} />
        </>
      )}

      {/* Admin Routes */}
      {user && user.role === "admin" && (
        <>
          <Route path={"/admin"} component={AdminDashboard} />
          <Route path={"/admin/users"} component={AdminUsers} />
          <Route path={"/admin/courses"} component={AdminCourseModeration} />
          <Route path={"/admin/payments"} component={AdminPayments} />
          <Route path={"/admin/settings"} component={AdminSettings} />
          <Route path={"/profile"} component={UserProfile} />
        </>
      )}

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
