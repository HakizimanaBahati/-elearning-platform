import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search, TrendingUp, Award, Clock } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: number;
  name: string;
  email: string;
  enrolledAt: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  status: "active" | "completed" | "inactive";
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    enrolledAt: "2024-01-15",
    progress: 85,
    lessonsCompleted: 17,
    totalLessons: 20,
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    enrolledAt: "2024-01-20",
    progress: 100,
    lessonsCompleted: 20,
    totalLessons: 20,
    status: "completed",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    enrolledAt: "2024-02-01",
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    status: "active",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    enrolledAt: "2024-02-10",
    progress: 20,
    lessonsCompleted: 4,
    totalLessons: 20,
    status: "inactive",
  },
];

export default function InstructorStudents() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "inactive">("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalEnrolled: mockStudents.length,
    completed: mockStudents.filter((s) => s.status === "completed").length,
    active: mockStudents.filter((s) => s.status === "active").length,
    avgProgress: Math.round(
      mockStudents.reduce((sum, s) => sum + s.progress, 0) / mockStudents.length
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Student Progress</h1>
          <p className="text-indigo-100">Track and manage your students' learning journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.totalEnrolled}</p>
                <p className="text-sm text-slate-600">Total Enrolled</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.avgProgress}%</p>
                <p className="text-sm text-slate-600">Avg Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Students
              </span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search students..."
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
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-slate-600">{student.email}</TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(student.enrolledAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {student.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {student.lessonsCompleted}/{student.totalLessons}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : student.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {student.status.charAt(0).toUpperCase() +
                            student.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No students found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
