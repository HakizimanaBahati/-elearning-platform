import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: number;
  studentName: string;
  email: string;
  amount: number;
  method: "mobile_money" | "bank_transfer";
  status: "completed" | "pending" | "failed";
  courseTitle: string;
  createdAt: string;
  certificateIssued: boolean;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    studentName: "John Doe",
    email: "john@example.com",
    amount: 49.99,
    method: "mobile_money",
    status: "completed",
    courseTitle: "Advanced Web Development",
    createdAt: "2024-04-07",
    certificateIssued: true,
  },
  {
    id: 2,
    studentName: "Jane Smith",
    email: "jane@example.com",
    amount: 39.99,
    method: "bank_transfer",
    status: "completed",
    courseTitle: "Python for Data Science",
    createdAt: "2024-04-06",
    certificateIssued: true,
  },
  {
    id: 3,
    studentName: "Bob Johnson",
    email: "bob@example.com",
    amount: 29.99,
    method: "mobile_money",
    status: "pending",
    courseTitle: "UI/UX Design Fundamentals",
    createdAt: "2024-04-05",
    certificateIssued: false,
  },
  {
    id: 4,
    studentName: "Alice Williams",
    email: "alice@example.com",
    amount: 59.99,
    method: "bank_transfer",
    status: "failed",
    courseTitle: "Mobile App Development",
    createdAt: "2024-04-04",
    certificateIssued: false,
  },
];

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalPayments: mockPayments.length,
    completed: mockPayments.filter((p) => p.status === "completed").length,
    pending: mockPayments.filter((p) => p.status === "pending").length,
    totalRevenue: mockPayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Payment Management</h1>
          <p className="text-indigo-100">Track and manage certificate payments</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CreditCard className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.totalPayments}</p>
                <p className="text-sm text-slate-600">Total Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-slate-600">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Payments
              </span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search payments..."
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {payment.studentName}
                          </p>
                          <p className="text-xs text-slate-500">{payment.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {payment.courseTitle}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {payment.method === "mobile_money"
                            ? "Mobile Money"
                            : "Bank Transfer"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status === "completed" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {payment.status === "pending" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {payment.status === "failed" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {payment.certificateIssued ? (
                          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                            ✓ Issued
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-indigo-600">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No payments found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
