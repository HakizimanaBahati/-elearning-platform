import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { BookOpen } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "instructor" | "admin">("user");
  const [, navigate] = useLocation();
  const { refresh } = useAuth({ redirectOnUnauthenticated: false });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async user => {
      toast.success("Account created successfully!");
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
      toast.error(error.message || "Failed to register");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    registerMutation.mutate({ name, email, password, role });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <span className="text-2xl font-bold text-slate-900">EduLearn</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Start your learning journey today
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
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
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3 pt-2">
              <Label>I want to:</Label>
              <RadioGroup
                value={role}
                onValueChange={(val: "user" | "instructor" | "admin") =>
                  setRole(val)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer">
                    Learn
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instructor" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer">
                    Teach
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="r3" />
                  <Label htmlFor="r3" className="cursor-pointer">
                    Admin
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
