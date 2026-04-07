import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { BookOpen, Users, CreditCard, Award, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: courses = [] } = trpc.courses.list.useQuery();

  // Calculate statistics
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-indigo-100">Manage platform, users, and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Total Courses</p>
                  <p className="text-3xl font-bold text-slate-900">{totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Published</p>
                  <p className="text-3xl font-bold text-slate-900">{publishedCourses}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
                <Users className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Revenue</p>
                  <p className="text-3xl font-bold text-slate-900">$0</p>
                </div>
                <CreditCard className="w-12 h-12 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Course Distribution</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Published Courses</span>
                        <span className="font-semibold">{publishedCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Draft Courses</span>
                        <span className="font-semibold">{totalCourses - publishedCourses}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">User Roles</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Students</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Instructors</span>
                        <span className="font-semibold">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  User management interface coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Payment management interface coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-center py-8">
                  Certificate management interface coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
