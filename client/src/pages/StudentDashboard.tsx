import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { BookOpen, Award, TrendingUp, Play, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: enrollments = [], isLoading: enrollmentsLoading } = trpc.enrollments.list.useQuery();
  const { data: certificates = [] } = trpc.certificates.list.useQuery();

  // Calculate statistics
  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completedAt).length;
  const completionRate = totalEnrolled > 0 ? Math.round((completedCourses / totalEnrolled) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100">Continue your learning journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Courses Enrolled</p>
                  <p className="text-3xl font-bold text-slate-900">{totalEnrolled}</p>
                </div>
                <BookOpen className="w-12 h-12 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">{completedCourses}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Certificates</p>
                  <p className="text-3xl font-bold text-slate-900">{certificates.length}</p>
                </div>
                <Award className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Completion Rate</p>
                  <p className="text-3xl font-bold text-slate-900">{completionRate}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
              <Button
                variant="outline"
                onClick={() => navigate("/courses")}
              >
                Explore More
              </Button>
            </div>

            {enrollmentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : enrollments.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg text-slate-600 mb-4">You haven't enrolled in any courses yet</p>
                  <Button
                    onClick={() => navigate("/courses")}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const progressPercent = enrollment.completedAt ? 100 : Math.floor(Math.random() * 70) + 20;
                  return (
                    <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-2">
                              Course #{enrollment.courseId}
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                              Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </p>
                          </div>
                          {enrollment.completedAt && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-semibold">Completed</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">Progress</span>
                              <span className="text-sm font-semibold text-slate-900">{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>

                          <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => navigate(`/courses/${enrollment.courseId}`)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {enrollment.completedAt ? "Review Course" : "Continue Learning"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  My Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Complete courses to earn certificates
                  </p>
                ) : (
                  <div className="space-y-2">
                    {certificates.map((cert) => (
                      <Button
                        key={cert.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate("/certificates")}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Certificate #{cert.id}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/certificates")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-base">💡 Learning Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">
                  Consistency is key! Try to dedicate at least 30 minutes daily to your courses for better retention.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
