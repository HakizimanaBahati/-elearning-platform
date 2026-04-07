import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search, Shield, Mail, Calendar, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "instructor" | "admin";
  createdAt: string;
  lastSignedIn: string;
  status: "active" | "inactive";
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2024-01-15",
    lastSignedIn: "2024-04-07",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "instructor",
    createdAt: "2024-01-20",
    lastSignedIn: "2024-04-06",
    status: "active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    createdAt: "2024-02-01",
    lastSignedIn: "2024-03-15",
    status: "inactive",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2024-02-10",
    lastSignedIn: "2024-04-07",
    status: "active",
  },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "instructor" | "admin">("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.status === "active").length,
    instructors: mockUsers.filter((u) => u.role === "instructor").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-indigo-100">Manage platform users and their roles</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
                <p className="text-sm text-slate-600">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.activeUsers}</p>
                <p className="text-sm text-slate-600">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.instructors}</p>
                <p className="text-sm text-slate-600">Instructors</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
                <p className="text-sm text-slate-600">Admins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Users
              </span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) =>
                    setFilterRole(e.target.value as typeof filterRole)
                  }
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Signed In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "instructor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(user.lastSignedIn).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
