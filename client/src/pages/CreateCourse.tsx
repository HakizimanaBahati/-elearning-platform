import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateCourse() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as const,
    price: "",
    thumbnail: "",
  });

  const createMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      toast.success("Course created successfully!");
      navigate("/instructor/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create course");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Create New Course</h1>
          <p className="text-indigo-100">Share your knowledge with students worldwide</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
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
                  placeholder="e.g., Introduction to Web Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your course, what students will learn, and prerequisites..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32"
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
                    placeholder="e.g., Technology, Business, Art"
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
                    Price (USD) - Leave empty for free
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
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
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Course"}
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

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Creating a Great Course</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a clear, descriptive title that reflects the course content</li>
              <li>• Write a detailed description to help students understand what they'll learn</li>
              <li>• Choose an appropriate difficulty level for your target audience</li>
              <li>• Add a professional thumbnail image to attract students</li>
              <li>• You can add lessons and content after creating the course</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
