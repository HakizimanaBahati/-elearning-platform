import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Edit2,
  Trash2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    refetch,
  } = trpc.courses.getByInstructor.useQuery();

  const deleteMutation = trpc.courses.delete.useMutation({
    onSuccess: () => {
      toast.success("Course deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });

  // Calculate statistics
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.isPublished).length;
  const draftCourses = courses.filter(c => !c.isPublished).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
              <p className="text-indigo-100">
                Manage your courses and track student progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-slate-100"
                onClick={() => navigate("/instructor/courses/create")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Course
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Total Courses</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalCourses}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Published</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {publishedCourses}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Drafts</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {draftCourses}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Course Analytics
          </h2>
          <AnalyticsCharts />
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>

          {coursesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-600 mb-4">
                  You haven't created any courses yet
                </p>
                <Button
                  onClick={() => navigate("/instructor/courses/create")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map(course => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {course.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              course.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>
                              Level:{" "}
                              <span className="font-semibold capitalize">
                                {course.level}
                              </span>
                            </span>
                          </div>
                          {course.price &&
                            parseFloat(course.price.toString()) > 0 && (
                              <div className="font-semibold text-slate-900">
                                $
                                {parseFloat(course.price.toString()).toFixed(2)}
                              </div>
                            )}
                          {course.requiresCertificate && (
                            <div className="flex items-center gap-1">
                              <span>✓ Certificate</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/instructor/courses/${course.id}/edit`)
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this course?"
                              )
                            ) {
                              deleteMutation.mutate({ id: course.id });
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-900">
                            0
                          </span>{" "}
                          students enrolled
                        </div>
                        <div>
                          Created{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
