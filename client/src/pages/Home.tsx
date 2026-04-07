import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BookOpen,
  Users,
  Award,
  Zap,
  ArrowRight,
  Play,
  LogOut,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "instructor") {
        navigate("/instructor/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/register");
    }
  };

  const handleExploreCourses = () => {
    navigate("/courses");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">E-HUB</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/courses")}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Courses
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </Button>
                {(user?.role === "instructor" || user?.role === "admin") && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/instructor/dashboard")}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Teach
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight">
                  Learn from the Best, Anytime, Anywhere
                </h1>
                <p className="text-xl text-slate-600">
                  Unlock your potential with our comprehensive online learning
                  platform. Access world-class courses, track your progress, and
                  earn certificates.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6"
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleExploreCourses}
                  className="text-lg px-8 py-6 border-2 border-slate-300 hover:bg-slate-50"
                >
                  Explore Courses
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-slate-900">10K+</p>
                  <p className="text-slate-600">Active Learners</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">500+</p>
                  <p className="text-slate-600">Courses Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">95%</p>
                  <p className="text-slate-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-10 blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-90" />
                    <p className="text-lg font-semibold">Watch Demo Course</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Video Tutorials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">
              Watch tutorials to get started with E-HUB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="For Students Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Students</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to register, browse courses, enroll, and track your
                  progress.
                </p>
              </CardContent>
            </Card>

            {/* For Instructors */}
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="For Instructors Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Instructors</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to create courses, add modules, lessons, and manage
                  students.
                </p>
              </CardContent>
            </Card>

            {/* For Admins */}
            <Card className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="For Admins Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Admins</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to manage users, courses, payments, enrollments, and
                  certificates.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Students</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to register, browse courses, enroll, and track your
                  progress.
                </p>
              </CardContent>
            </Card>

            {/* For Instructors */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-600 rounded-t-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Instructors</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to create courses, add modules, lessons, and manage
                  your students.
                </p>
              </CardContent>
            </Card>

            {/* For Admins */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 rounded-t-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-2">For Admins</h3>
                <p className="text-slate-600 text-sm">
                  Learn how to manage users, courses, payments, enrollments, and
                  certificates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose E-HUB?</h2>
            <p className="text-xl text-slate-300">
              Everything you need to learn, teach, and succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Comprehensive Courses",
                description:
                  "Access thousands of courses across multiple categories and skill levels",
              },
              {
                icon: Users,
                title: "Expert Instructors",
                description:
                  "Learn from industry professionals and experienced educators",
              },
              {
                icon: Award,
                title: "Earn Certificates",
                description:
                  "Get recognized with professional certificates upon completion",
              },
              {
                icon: Zap,
                title: "Learn at Your Pace",
                description:
                  "Study whenever you want with lifetime access to course materials",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="bg-slate-800 border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <CardHeader>
                    <Icon className="w-12 h-12 text-indigo-400 mb-4" />
                    <CardTitle className="text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of students already learning on E-HUB. Start your
            journey today!
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 hover:bg-slate-100 text-lg px-8 py-6 font-semibold"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                <span className="text-lg font-bold text-white">E-HUB</span>
              </div>
              <p className="text-sm">Empowering learners worldwide</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/courses" className="hover:text-white transition">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Instructors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 E-HUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
