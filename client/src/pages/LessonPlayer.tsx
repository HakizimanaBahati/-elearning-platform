import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle, MessageCircle, BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AIChatAssistant } from "@/components/AIChatAssistant";

export default function LessonPlayer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonId = parseInt(id || "0");
  const { data: lesson, isLoading: lessonLoading } = trpc.lessons.getById.useQuery(
    { id: lessonId },
    { enabled: !!lessonId }
  );

  const markCompleteMutation = trpc.progress.record.useMutation({
    onSuccess: () => {
      toast.success("Lesson marked as complete!");
      setIsCompleted(true);
    },
    onError: () => {
      toast.error("Failed to mark lesson as complete");
    },
  });

  const sendChatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent!");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 mb-4">Lesson not found</p>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="bg-black aspect-video flex items-center justify-center">
                {lesson.videoUrl ? (
                  <video
                    src={lesson.videoUrl}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-white text-center">
                    <p className="text-lg">No video available</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Lesson Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                    {lesson.duration && (
                      <p className="text-sm text-slate-600 mt-2">
                        Duration: {Math.floor(lesson.duration / 60)} minutes
                      </p>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{lesson.description}</p>
                <Button
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    markCompleteMutation.mutate({
                      enrollmentId: 1, // TODO: Get actual enrollment ID
                      lessonId,
                      completed: true,
                    });
                  }}
                  disabled={markCompleteMutation.isPending || isCompleted}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tabs for Transcription and Notes */}
            <Tabs defaultValue="transcription" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transcription">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Transcription
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcription" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    {lesson.transcription ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {lesson.transcription}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-600 text-center py-8">
                        Transcription not available yet. Check back soon!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes here..."
                      className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <Button
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        markCompleteMutation.mutate({
                          enrollmentId: 1, // TODO: Get actual enrollment ID
                          lessonId,
                          notes,
                        });
                        toast.success("Notes saved!");
                      }}
                    >
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - AI Chatbot */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 h-[600px]">
              <AIChatAssistant courseId={lesson.courseId} lessonId={lessonId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
