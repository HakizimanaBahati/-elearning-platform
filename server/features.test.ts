import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Helper to create authenticated context
function createAuthContext(role: "user" | "instructor" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("E-Learning Platform Features", () => {
  describe("Course Management", () => {
    it("should allow instructors to create courses", async () => {
      const ctx = createAuthContext("instructor");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.courses.create({
        title: "Test Course",
        description: "A test course",
        category: "programming",
        level: "beginner",
        price: "29.99",
        requiresCertificate: true,
        isPublished: false,
      });

      expect(result).toBeDefined();
      expect(result.title).toBe("Test Course");
      expect(result.instructorId).toBe(ctx.user?.id);
    });

    it("should prevent students from creating courses", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.courses.create({
          title: "Test Course",
          description: "A test course",
          category: "programming",
          level: "beginner",
          price: "29.99",
          requiresCertificate: true,
          isPublished: false,
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow students to browse published courses", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const courses = await caller.courses.getPublished({
        category: "all",
        level: "all",
        search: "",
      });

      expect(Array.isArray(courses)).toBe(true);
    });
  });

  describe("Enrollment System", () => {
    it("should allow students to enroll in courses", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.enrollments.enroll({
        courseId: 1,
      });

      expect(result).toBeDefined();
      expect(result.studentId).toBe(ctx.user?.id);
      expect(result.courseId).toBe(1);
    });

    it("should prevent double enrollment", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      // First enrollment
      await caller.enrollments.enroll({ courseId: 1 });

      // Second enrollment should fail
      try {
        await caller.enrollments.enroll({ courseId: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should allow students to view their enrollments", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const enrollments = await caller.enrollments.getStudentEnrollments();

      expect(Array.isArray(enrollments)).toBe(true);
    });
  });

  describe("Progress Tracking", () => {
    it("should allow students to mark lessons as complete", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.progress.markLessonComplete({
        lessonId: 1,
        courseId: 1,
      });

      expect(result).toBeDefined();
      expect(result.isCompleted).toBe(true);
    });

    it("should calculate course progress correctly", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const progress = await caller.progress.getCourseProgress({
        courseId: 1,
      });

      expect(progress).toBeDefined();
      expect(typeof progress.completionPercentage).toBe("number");
      expect(progress.completionPercentage).toBeGreaterThanOrEqual(0);
      expect(progress.completionPercentage).toBeLessThanOrEqual(100);
    });
  });

  describe("Certificate Management", () => {
    it("should generate certificate on course completion", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const certificate = await caller.certificates.generateCertificate({
        courseId: 1,
      });

      expect(certificate).toBeDefined();
      expect(certificate.studentId).toBe(ctx.user?.id);
      expect(certificate.courseId).toBe(1);
      expect(certificate.issuedAt).toBeDefined();
    });

    it("should allow students to view their certificates", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const certificates = await caller.certificates.getStudentCertificates();

      expect(Array.isArray(certificates)).toBe(true);
    });
  });

  describe("AI Chatbot", () => {
    it("should allow students to send chat messages", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const response = await caller.chat.sendMessage({
        courseId: 1,
        message: "What is this lesson about?",
      });

      expect(response).toBeDefined();
      expect(typeof response.reply).toBe("string");
      expect(response.reply.length).toBeGreaterThan(0);
    });

    it("should provide context-aware responses", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const response = await caller.chat.sendMessage({
        courseId: 1,
        message: "Can you explain the concept we just learned?",
      });

      expect(response).toBeDefined();
      expect(response.reply).toBeDefined();
    });
  });

  describe("Admin Operations", () => {
    it("should allow admins to view all users", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const users = await caller.admin.getAllUsers();

      expect(Array.isArray(users)).toBe(true);
    });

    it("should prevent non-admins from viewing all users", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getAllUsers();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admins to moderate courses", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.approveCourse({
        courseId: 1,
      });

      expect(result).toBeDefined();
      expect(result.isPublished).toBe(true);
    });
  });

  describe("Payment Processing", () => {
    it("should create payment records", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const payment = await caller.payments.createPayment({
        courseId: 1,
        amount: 29.99,
        method: "mobile_money",
      });

      expect(payment).toBeDefined();
      expect(payment.studentId).toBe(ctx.user?.id);
      expect(payment.amount).toBe(29.99);
      expect(payment.status).toBe("pending");
    });

    it("should verify and complete payments", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const payment = await caller.payments.verifyPayment({
        paymentId: 1,
        transactionId: "TXN123456",
      });

      expect(payment).toBeDefined();
      expect(payment.status).toBe("completed");
    });
  });

  describe("Authentication", () => {
    it("should allow users to logout", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
    });

    it("should return current user info", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.id).toBe(ctx.user?.id);
      expect(user?.role).toBe("user");
    });
  });
});
