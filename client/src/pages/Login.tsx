import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BookOpen, LogOut } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();
  const { refresh, user, logout, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: false,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async user => {
      toast.success("Successfully logged in");
      await refresh();
      if (user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: error => {
      toast.error(error.message || "Failed to login");
    },
  });

  const handleLogout = async () => {
    await logout();
    await refresh();
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Already logged in
            </CardTitle>
            <CardDescription className="text-center">
              You are logged in as {user.name || user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              onClick={() => {
                if (user.role === "instructor")
                  navigate("/instructor/dashboard");
                else if (user.role === "admin") navigate("/admin");
                else navigate("/dashboard");
              }}
            >
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <span className="text-2xl font-bold text-slate-900">E-HUB</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Sign In"}
            </Button>
            <div className="text-sm text-center text-slate-600">
              Don't have an account?{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign up
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
