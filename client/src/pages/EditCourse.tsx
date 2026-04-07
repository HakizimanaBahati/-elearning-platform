import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const courseId = parseInt(id || "0");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as const,
    price: "",
    thumbnail: "",
    isPublished: false,
  });

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { id: courseId },
    { enabled: !!courseId }
  );

  const { data: lessons = [], isLoading: lessonsLoading } = trpc.lessons.getByCourse.useQuery(
    { courseId },
    { enabled: !!courseId }
  );

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Course updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update course");
    },
  });

  const deleteLessonMutation = trpc.lessons.delete.useMutation({
    onSuccess: () => {
      toast.success("Lesson deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete lesson");
    },
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description || "",
        category: course.category || "",
        level: (course.level || "beginner") as any,
        price: course.price?.toString() || "",
        thumbnail: course.thumbnail || "",
        isPublished: course.isPublished || false,
      });
    }
  }, [course]);

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
          <Button onClick={() => navigate("/instructor/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: courseId, ...formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/instructor/dashboard")}
            className="text-white hover:bg-white/20 mb-6"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Edit Course</h1>
          <p className="text-indigo-100">{course.title}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Course Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="h-32"
                    />
                  </div>

                  {/* Category and Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Category
                      </label>
                      <Input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Level
                      </label>
                      <Select value={formData.level} onValueChange={(value: any) => setFormData({ ...formData, level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price and Thumbnail */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Price (USD)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Thumbnail URL
                      </label>
                      <Input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Publish Status */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="text-sm font-semibold text-slate-900">
                        Publish this course (make it visible to students)
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/instructor/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Lessons</CardTitle>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    toast.info("Lesson creation coming soon");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </CardHeader>
              <CardContent>
                {lessonsLoading ? (
                  <p className="text-slate-600">Loading lessons...</p>
                ) : lessons.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">
                    No lessons yet. Add your first lesson to get started!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {idx + 1}
                            </span>
                            <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{lesson.description}</p>
                          {lesson.duration && (
                            <p className="text-xs text-slate-500 mt-1">
                              Duration: {Math.floor(lesson.duration / 60)} minutes
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Delete this lesson?")) {
                              deleteLessonMutation.mutate({ id: lesson.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
