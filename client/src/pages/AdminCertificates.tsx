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
  Award,
  Search,
  CheckCircle,
  Calendar,
  ExternalLink,
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
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminCertificates() {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: certificates = [] } = trpc.admin.getAllCertificates.useQuery();

  const filtered = certificates.filter(
    c =>
      c.id.toString().includes(searchTerm) ||
      (c.certificateNumber || "").includes(searchTerm) ||
      c.studentId.toString().includes(searchTerm)
  );

  const stats = {
    total: certificates.length,
    thisMonth: certificates.filter(c => {
      const d = new Date(c.issuedAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length,
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
            <h1 className="text-4xl font-bold mb-2">Certificate Management</h1>
            <p className="text-indigo-100">
              View and manage all issued certificates
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white text-indigo-600"
              onClick={() => setLocation("/admin")}
            >
              Back to Dashboard
            </Button>
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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-slate-600">Total Certificates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold">{stats.thisMonth}</p>
              <p className="text-sm text-slate-600">This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold">{certificates.length}</p>
              <p className="text-sm text-slate-600">Issued</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>All Certificates ({filtered.length})</span>
              <div className="flex gap-2">
                <Input
                  placeholder="Search certificate ID or number..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course ID</TableHead>
                  <TableHead>Certificate #</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(cert => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-semibold">#{cert.id}</TableCell>
                    <TableCell>{cert.studentId}</TableCell>
                    <TableCell>{cert.courseId}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {cert.certificateNumber || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {cert.certificateUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(cert.certificateUrl || "", "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-sm">No URL</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No certificates found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
