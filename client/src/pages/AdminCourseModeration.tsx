import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Eye, Ban, CheckCircle, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: number;
  title: string;
  instructor: string;
  students: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reports: number;
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Advanced Web Development",
    instructor: "John Doe",
    students: 145,
    status: "approved",
    createdAt: "2024-01-15",
    reports: 0,
  },
  {
    id: 2,
    title: "Python for Data Science",
    instructor: "Jane Smith",
    students: 89,
    status: "pending",
    createdAt: "2024-04-05",
    reports: 1,
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Bob Johnson",
    students: 0,
    status: "pending",
    createdAt: "2024-04-06",
    reports: 2,
  },
  {
    id: 4,
    title: "Mobile App Development",
    instructor: "Alice Williams",
    students: 234,
    status: "approved",
    createdAt: "2024-02-10",
    reports: 0,
  },
];

export default function AdminCourseModeration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCourses: mockCourses.length,
    pending: mockCourses.filter((c) => c.status === "pending").length,
    approved: mockCourses.filter((c) => c.status === "approved").length,
    reported: mockCourses.filter((c) => c.reports > 0).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Course Moderation</h1>
          <p className="text-indigo-100">Review and manage course content</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.totalCourses}</p>
                <p className="text-sm text-slate-600">Total Courses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                <p className="text-sm text-slate-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
                <p className="text-sm text-slate-600">Approved</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Ban className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.reported}</p>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as typeof filterStatus)
                  }
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
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
                    <TableHead>Instructor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {course.title}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {course.instructor}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {course.students}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            course.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : course.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {course.status.charAt(0).toUpperCase() +
                            course.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {course.reports > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            {course.reports}
                          </span>
                        )}
                        {course.reports === 0 && (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {course.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
