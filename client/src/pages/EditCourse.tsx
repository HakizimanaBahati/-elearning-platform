import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  FolderOpen,
} from "lucide-react";

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

  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    order: 0,
    lessonType: "video" as "video" | "document",
    content: "",
    moduleId: undefined as number | undefined,
  });

  const { data: course, isLoading: courseLoading } =
    trpc.courses.getById.useQuery({ id: courseId }, { enabled: !!courseId });

  const { data: modules = [], isLoading: modulesLoading } =
    trpc.modules.getByCourse.useQuery({ courseId }, { enabled: !!courseId });

  const { data: lessons = [], isLoading: lessonsLoading } =
    trpc.lessons.getByCourse.useQuery({ courseId }, { enabled: !!courseId });

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: () => toast.success("Course updated successfully!"),
    onError: error => toast.error(error.message || "Failed to update course"),
  });

  const deleteLessonMutation = trpc.lessons.delete.useMutation({
    onSuccess: () => toast.success("Lesson deleted!"),
    onError: () => toast.error("Failed to delete lesson"),
  });

  const createLessonMutation = trpc.lessons.create.useMutation({
    onSuccess: () => {
      toast.success("Lesson created!");
      setIsLessonDialogOpen(false);
      setNewLesson({
        title: "",
        description: "",
        videoUrl: "",
        duration: 0,
        order: 0,
        lessonType: "video",
        content: "",
        moduleId: undefined,
      });
    },
    onError: error => toast.error(error.message || "Failed to create lesson"),
  });

  const createModuleMutation = trpc.modules.create.useMutation({
    onSuccess: () => {
      toast.success("Module created!");
      setIsModuleDialogOpen(false);
      setNewModule({ title: "", description: "", order: 0 });
    },
    onError: error => toast.error(error.message || "Failed to create module"),
  });

  const deleteModuleMutation = trpc.modules.delete.useMutation({
    onSuccess: () => toast.success("Module deleted!"),
    onError: () => toast.error("Failed to delete module"),
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

  useEffect(() => {
    if (modules.length > 0) {
      setExpandedModules(new Set(modules.map((m: any) => m.id)));
    }
  }, [modules]);

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
          <p className="text-2xl font-bold text-slate-900 mb-4">
            Course not found
          </p>
          <Button onClick={() => navigate("/instructor/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: courseId, ...formData });
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const getLessonsForModule = (moduleId: number | null) =>
    lessons.filter((l: any) => l.moduleId === moduleId);

  const ungroupedLessons = getLessonsForModule(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
            <TabsTrigger value="lessons">
              Modules & Lessons ({modules.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Course Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={e =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="h-32"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Category
                      </label>
                      <Input
                        type="text"
                        value={formData.category}
                        onChange={e =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Level
                      </label>
                      <Select
                        value={formData.level}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                        onChange={e =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Thumbnail URL
                      </label>
                      <Input
                        type="url"
                        value={formData.thumbnail}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            thumbnail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            isPublished: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="text-sm font-semibold text-slate-900">
                        Publish this course
                      </span>
                    </label>
                  </div>
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
            <div className="flex gap-3 mb-4">
              <Dialog
                open={isModuleDialogOpen}
                onOpenChange={setIsModuleDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Module</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Module Title</Label>
                      <Input
                        value={newModule.title}
                        onChange={e =>
                          setNewModule({ ...newModule, title: e.target.value })
                        }
                        placeholder="e.g., Introduction, Chapter 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newModule.description}
                        onChange={e =>
                          setNewModule({
                            ...newModule,
                            description: e.target.value,
                          })
                        }
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={newModule.order}
                        onChange={e =>
                          setNewModule({
                            ...newModule,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsModuleDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        createModuleMutation.mutate({ courseId, ...newModule })
                      }
                      disabled={!newModule.title.trim()}
                    >
                      Create Module
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lesson</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Module (Optional)</Label>
                      <Select
                        value={
                          newLesson.moduleId === undefined
                            ? "none"
                            : newLesson.moduleId.toString()
                        }
                        onValueChange={val =>
                          setNewLesson({
                            ...newLesson,
                            moduleId:
                              val === "none" ? undefined : parseInt(val),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select module or none" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Module</SelectItem>
                          {modules.map((m: any) => (
                            <SelectItem key={m.id} value={m.id.toString()}>
                              {m.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Lesson Type</Label>
                      <Select
                        value={newLesson.lessonType}
                        onValueChange={(val: "video" | "document") =>
                          setNewLesson({ ...newLesson, lessonType: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Lesson</SelectItem>
                          <SelectItem value="document">
                            Document/Text Lesson
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Lesson Title</Label>
                      <Input
                        value={newLesson.title}
                        onChange={e =>
                          setNewLesson({ ...newLesson, title: e.target.value })
                        }
                        placeholder="Enter lesson title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newLesson.description}
                        onChange={e =>
                          setNewLesson({
                            ...newLesson,
                            description: e.target.value,
                          })
                        }
                        placeholder="Lesson description"
                      />
                    </div>
                    {newLesson.lessonType === "video" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Video URL</Label>
                          <Input
                            value={newLesson.videoUrl}
                            onChange={e =>
                              setNewLesson({
                                ...newLesson,
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={newLesson.duration}
                            onChange={e =>
                              setNewLesson({
                                ...newLesson,
                                duration: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Label>Content (Text/Markdown)</Label>
                        <Textarea
                          value={newLesson.content}
                          onChange={e =>
                            setNewLesson({
                              ...newLesson,
                              content: e.target.value,
                            })
                          }
                          placeholder="Enter lesson content..."
                          className="min-h-[200px]"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={newLesson.order}
                        onChange={e =>
                          setNewLesson({
                            ...newLesson,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsLessonDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        createLessonMutation.mutate({ ...newLesson, courseId })
                      }
                      disabled={
                        !newLesson.title.trim() ||
                        createLessonMutation.isPending
                      }
                    >
                      {createLessonMutation.isPending
                        ? "Creating..."
                        : "Create Lesson"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {modulesLoading || lessonsLoading ? (
              <p className="text-slate-600">Loading...</p>
            ) : modules.length === 0 && ungroupedLessons.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                No modules or lessons yet. Create your first module to get
                started!
              </p>
            ) : (
              <div className="space-y-4">
                {modules.map((module: any) => {
                  const moduleLessons = getLessonsForModule(module.id);
                  const isExpanded = expandedModules.has(module.id);
                  return (
                    <Card key={module.id}>
                      <CardHeader
                        className="py-3 flex flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                          <CardTitle className="text-lg">
                            {module.title}
                          </CardTitle>
                          <span className="text-sm text-slate-500">
                            ({moduleLessons.length} lessons)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={e => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Delete this module? Lessons will be ungrouped."
                              )
                            )
                              deleteModuleMutation.mutate({ id: module.id });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                      {isExpanded && moduleLessons.length > 0 && (
                        <CardContent className="pt-0 space-y-2">
                          {moduleLessons.map((lesson: any, idx: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                    {idx + 1}
                                  </span>
                                  <span className="font-medium text-slate-900">
                                    {lesson.title}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                    {lesson.lessonType}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm("Delete this lesson?"))
                                    deleteLessonMutation.mutate({
                                      id: lesson.id,
                                    });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}

                {ungroupedLessons.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Ungrouped Lessons
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {ungroupedLessons.map((lesson: any, idx: number) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-slate-400 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              <span className="font-medium text-slate-900">
                                {lesson.title}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                {lesson.lessonType}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              if (confirm("Delete this lesson?"))
                                deleteLessonMutation.mutate({ id: lesson.id });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
