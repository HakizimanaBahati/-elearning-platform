import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { BookOpen, Users, Clock, Award, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const courseId = parseInt(id || "0");
  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { id: courseId },
    { enabled: !!courseId }
  );

  const { data: lessons = [], isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery(
    { courseId },
    { enabled: !!courseId }
  );

  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in course!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll");
    },
  });

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 mb-4">Course not found</p>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="text-white hover:bg-white/20 mb-6"
          >
            ← Back to Courses
          </Button>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-indigo-100 text-lg">{course.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Thumbnail */}
            {course.thumbnail && (
              <div className="rounded-lg overflow-hidden shadow-lg h-96 bg-gradient-to-br from-indigo-400 to-purple-500">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-slate-600">Level</p>
                      <p className="font-semibold capitalize">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-slate-600">Lessons</p>
                      <p className="font-semibold">{lessons.length}</p>
                    </div>
                  </div>
                  {course.requiresCertificate && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-slate-600">Certificate</p>
                        <p className="font-semibold">Available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessonsLoading ? (
                    <p className="text-slate-600">Loading lessons...</p>
                  ) : lessons.length === 0 ? (
                    <p className="text-slate-600">No lessons yet</p>
                  ) : (
                    lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{lesson.description}</p>
                          {lesson.duration && (
                            <p className="text-xs text-slate-500 mt-1">
                              Duration: {Math.floor(lesson.duration / 60)} minutes
                            </p>
                          )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg">
              <CardHeader>
                <div className="text-center">
                  {course.price && parseFloat(course.price.toString()) > 0 ? (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Price</p>
                      <p className="text-4xl font-bold text-indigo-600">
                        ${parseFloat(course.price.toString()).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-green-600">Free</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => enrollMutation.mutate({ courseId })}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>Instructor-led</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>Learn at your pace</span>
                  </div>
                  {course.requiresCertificate && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>Certificate included</span>
                    </div>
                  )}
                </div>

                {course.category && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-slate-600 mb-2">Category</p>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
