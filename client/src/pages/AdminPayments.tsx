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
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
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
import { LogOut } from "lucide-react";

export default function AdminPayments() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: payments = [], refetch } = trpc.admin.getAllPayments.useQuery();
  const updateStatusMutation = trpc.admin.updatePaymentStatus.useMutation({
    onSuccess: () => {
      toast.success("Payment status updated");
      refetch();
    },
    onError: e => {
      toast.error(e.message);
    },
  });

  const filtered = payments.filter(p => {
    const match =
      p.studentId.toString().includes(searchTerm) ||
      p.courseId.toString().includes(searchTerm) ||
      p.id.toString().includes(searchTerm);
    return match && (filterStatus === "all" || p.status === filterStatus);
  });

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === "completed").length,
    pending: payments.filter(p => p.status === "pending").length,
    failed: payments.filter(p => p.status === "failed").length,
    revenue: payments
      .filter(p => p.status === "completed")
      .reduce((s, p) => s + (parseFloat(p.amount as string) || 0), 0),
  };

  const changeStatus = (id: number, status: string) => {
    if (confirm(`Change status to ${status}?`)) {
      updateStatusMutation.mutate({
        paymentId: id,
        status: status as "completed" | "pending" | "failed",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Payment Management</h1>
            <p className="text-indigo-100">Track and manage payments</p>
          </div>
          <Button
            variant="outline"
            className="bg-white text-indigo-600"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-slate-600">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold">{stats.completed}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-3xl font-bold">{stats.pending}</p>
              <p className="text-sm text-slate-600">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-3xl font-bold">{stats.failed}</p>
              <p className="text-sm text-slate-600">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold">
                FRW {stats.revenue.toFixed(2)}
              </p>
              <p className="text-sm text-slate-600">Revenue</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>All Payments ({filtered.length})</span>
              <div className="flex gap-2">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const st = p.status || "pending";
                  return (
                    <TableRow key={p.id}>
                      <TableCell>#{p.id}</TableCell>
                      <TableCell>{p.studentId}</TableCell>
                      <TableCell>{p.courseId}</TableCell>
                      <TableCell>
                        FRW {parseFloat(p.amount as string).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {p.paymentMethod === "mtn_mobile_money"
                            ? "MTN Mobile"
                            : p.paymentMethod === "airtel_money"
                              ? "Airtel Money"
                              : "Equity Bank"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${st === "completed" ? "bg-green-100 text-green-800" : st === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                        >
                          {st}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {st !== "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => changeStatus(p.id, "completed")}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          {st !== "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => changeStatus(p.id, "pending")}
                            >
                              <Clock className="w-4 h-4 text-yellow-600" />
                            </Button>
                          )}
                          {st !== "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => changeStatus(p.id, "failed")}
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No payments found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
