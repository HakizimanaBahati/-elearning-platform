import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  BookOpen,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  XCircle,
  GraduationCap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

type FilterType = "all" | "completed" | "in_progress" | "not_started";

export default function AdminEnrollments() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterType>("all");

  const { data: enrollments = [] } = trpc.admin.getAllEnrollments.useQuery();
  const { data: users = [] } = trpc.admin.getAllUsers.useQuery();

  const instructors = users.filter((u: any) => u.role === "instructor");

  const filteredEnrollments = enrollments.filter((e: any) => {
    const matchesSearch =
      e.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const isCompleted = !!e.completedAt;
    const hasStarted = !!e.enrolledAt;

    if (filterStatus === "completed") return matchesSearch && isCompleted;
    if (filterStatus === "in_progress")
      return matchesSearch && hasStarted && !isCompleted;
    if (filterStatus === "not_started") return matchesSearch && !hasStarted;
    return matchesSearch;
  });

  const completedCount = enrollments.filter((e: any) => e.completedAt).length;
  const inProgressCount = enrollments.filter(
    (e: any) => e.enrolledAt && !e.completedAt
  ).length;
  const notStartedCount = enrollments.filter((e: any) => !e.enrolledAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Enrollments Management</h1>
              <p className="text-indigo-100 mt-1">
                View all student course enrollments
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {inProgressCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Not Started</p>
                  <p className="text-3xl font-bold text-slate-600">
                    {notStartedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollments Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Enrollments</CardTitle>
              <div className="flex items-center gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(val: FilterType) => setFilterStatus(val)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Enrollments</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by student or course..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Certificate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-slate-500"
                    >
                      No enrollments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnrollments.map((enrollment: any) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {enrollment.studentName || "Unknown"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {enrollment.studentEmail || "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {enrollment.courseTitle || "Unknown Course"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {enrollment.enrolledAt
                            ? new Date(
                                enrollment.enrolledAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {enrollment.completedAt ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : enrollment.enrolledAt ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            Not Started
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {enrollment.certificateId ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <Award className="w-4 h-4" />
                            Issued
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Instructors List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {instructors.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No instructors found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructors.map((instructor: any) => (
                    <TableRow key={instructor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {instructor.name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {instructor.email || "No email"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {instructor.createdAt
                          ? new Date(instructor.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
