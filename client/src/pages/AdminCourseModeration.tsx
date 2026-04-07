import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminCourseModeration() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");

  const { data: courses = [], refetch } = trpc.admin.getAllCourses.useQuery();
  const deleteCourseMutation = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => {
      toast.success("Course deleted");
      refetch();
    },
    onError: e => {
      toast.error(e.message);
    },
  });

  const filteredCourses = courses.filter(
    course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    drafts: courses.filter(c => !c.isPublished).length,
  };

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourseMutation.mutate({ courseId });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Course Moderation</h1>
            <p className="text-indigo-100">Review and manage course content</p>
          </div>
          <Button
            variant="outline"
            className="bg-white text-indigo-600 hover:bg-slate-100"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-sm text-slate-600">Total Courses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">
                  {stats.drafts}
                </p>
                <p className="text-sm text-slate-600">Drafts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">
                  {stats.published}
                </p>
                <p className="text-sm text-slate-600">Published</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Ban className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600">Reported</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Courses
              </span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e =>
                    setFilterStatus(e.target.value as typeof filterStatus)
                  }
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {course.title}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {course.category || "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {course.level || "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            course.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No courses found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
