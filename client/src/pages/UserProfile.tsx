import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Shield, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = async () => {
    try {
      // TODO: Implement profile update mutation
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-slate-600 mb-4">Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-indigo-100">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Personal Information
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Full Name
                      </label>
                      <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <p className="text-slate-900">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <p className="text-slate-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Role & Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Role & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Current Role
                  </label>
                  <div className="inline-block">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "instructor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Administrator"
                        : user.role === "instructor"
                        ? "Instructor"
                        : "Student"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-600 mb-3">
                    {user.role === "admin"
                      ? "You have full access to the platform including user management, course moderation, and analytics."
                      : user.role === "instructor"
                      ? "You can create and manage courses, view student progress, and access instructor analytics."
                      : "You can enroll in courses, track your progress, and earn certificates."}
                  </p>

                  {user.role === "user" && (
                    <Button variant="outline" className="w-full">
                      Become an Instructor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <p className="text-3xl font-bold text-indigo-600">5</p>
                  <p className="text-sm text-slate-600">Courses Enrolled</p>
                </div>
                <div className="border-t pt-4 text-center">
                  <p className="text-3xl font-bold text-green-600">3</p>
                  <p className="text-sm text-slate-600">Certificates Earned</p>
                </div>
                <div className="border-t pt-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">68%</p>
                  <p className="text-sm text-slate-600">Average Progress</p>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Two-Factor Auth
                </Button>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
