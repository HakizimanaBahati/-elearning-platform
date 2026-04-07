import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  router,
} from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sdk } from "./_core/sdk";

console.log("[Router] Initializing TRPC routers...");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        const valid = await bcrypt.compare(input.password, user.password);
        if (!valid)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return user;
      }),
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
          name: z.string().min(2),
          role: z.enum(["user", "instructor", "admin"]).default("user"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists",
          });

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await db.createUser({
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
          openId: nanoid(),
        });

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return user;
      }),
  }),

  // ============ ADMIN ROUTES ============
  admin: router({
    getAllUsers: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),

    createUser: adminProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          password: z.string().min(6),
          role: z.enum(["user", "instructor", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists",
          });
        const hashedPassword = await bcrypt.hash(input.password, 10);
        return await db.createUser({
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
          openId: nanoid(),
        });
      }),

    updateUserRole: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          role: z.enum(["user", "instructor", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        return await db.updateUserRole(input.userId, input.role);
      }),

    deleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteUser(input.userId);
      }),

    getAllCourses: adminProcedure.query(async () => {
      return await db.getAllCoursesForAdmin();
    }),

    deleteCourse: adminProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCourse(input.courseId);
      }),

    getStats: adminProcedure.query(async () => {
      const users = await db.getAllUsers();
      const courses = await db.getAllCoursesForAdmin();
      const enrollments = await db.getAllEnrollments();
      const payments = await db.getAllPayments();

      return {
        totalUsers: users.length,
        totalInstructors: users.filter(u => u.role === "instructor").length,
        totalAdmins: users.filter(u => u.role === "admin").length,
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished).length,
        totalEnrollments: enrollments.length,
        totalRevenue: payments
          .filter(p => p.status === "completed")
          .reduce((sum, p) => sum + parseFloat(p.amount as string), 0),
      };
    }),

    getAllPayments: adminProcedure.query(async () => {
      return await db.getAllPayments();
    }),

    updatePaymentStatus: adminProcedure
      .input(
        z.object({
          paymentId: z.number(),
          status: z.enum(["completed", "pending", "failed"]),
        })
      )
      .mutation(async ({ input }) => {
        return await db.updatePaymentStatus(input.paymentId, input.status);
      }),

    getAllCertificates: adminProcedure.query(async () => {
      return await db.getAllCertificates();
    }),
  }),

  // ============ COURSES ============
  courses: router({
    list: publicProcedure.query(async () => {
      return await db.getPublishedCourses();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const course = await db.getCourseById(input.id);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        return course;
      }),

    getByInstructor: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await db.getCoursesByInstructor(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          category: z.string().optional(),
          level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
          thumbnail: z.string().optional(),
          price: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (
          (ctx.user.role as string) !== "instructor" &&
          ctx.user.role !== "admin"
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await db.createCourse({
          instructorId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          level: input.level || "beginner",
          thumbnail: input.thumbnail,
          price: input.price ? parseFloat(input.price).toString() : "0",
        });
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
          thumbnail: z.string().optional(),
          price: z.string().optional(),
          isPublished: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.id);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateCourse(input.id, {
          title: input.title,
          description: input.description,
          category: input.category,
          level: input.level,
          thumbnail: input.thumbnail,
          price: input.price ? parseFloat(input.price).toString() : undefined,
          isPublished: input.isPublished,
        });
        return await db.getCourseById(input.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.id);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.deleteCourse(input.id);
        return { success: true };
      }),
  }),

  // ============ LESSONS ============
  lessons: router({
    getByCourse: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonsByCourse(input.courseId);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
        return lesson;
      }),

    create: protectedProcedure
      .input(
        z.object({
          courseId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          lessonType: z.enum(["video", "document"]).default("video"),
          moduleId: z.number().optional(),
          videoUrl: z.string().optional(),
          videoKey: z.string().optional(),
          content: z.string().optional(),
          duration: z.number().optional(),
          order: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await db.createLesson({
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          lessonType: input.lessonType,
          moduleId: input.moduleId,
          videoUrl: input.videoUrl,
          videoKey: input.videoKey,
          content: input.content,
          duration: input.duration,
          order: input.order,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          videoUrl: z.string().optional(),
          videoKey: z.string().optional(),
          duration: z.number().optional(),
          transcription: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
        const course = await db.getCourseById(lesson.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateLesson(input.id, {
          title: input.title,
          description: input.description,
          videoUrl: input.videoUrl,
          videoKey: input.videoKey,
          duration: input.duration,
          transcription: input.transcription,
          order: input.order,
        });
        return await db.getLessonById(input.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const lesson = await db.getLessonById(input.id);
        if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
        const course = await db.getCourseById(lesson.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.deleteLesson(input.id);
        return { success: true };
      }),
  }),

  // ============ MODULES ============
  modules: router({
    getByCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getModulesByCourse(input.courseId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          courseId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          order: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await db.createModule({
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          order: input.order,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const module = await db.getModuleById(input.id);
        if (!module) throw new TRPCError({ code: "NOT_FOUND" });
        const course = await db.getCourseById(module.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateModule(input.id, {
          title: input.title,
          description: input.description,
          order: input.order,
        });
        return await db.getModuleById(input.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const module = await db.getModuleById(input.id);
        if (!module) throw new TRPCError({ code: "NOT_FOUND" });
        const course = await db.getCourseById(module.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.deleteModule(input.id);
        return { success: true };
      }),
  }),

  // ============ ENROLLMENTS ============
  enrollments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getStudentEnrollments(ctx.user.id);
    }),

    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });

        const existing = await db.getStudentEnrollmentForCourse(
          ctx.user.id,
          input.courseId
        );
        if (existing)
          throw new TRPCError({
            code: "CONFLICT",
            message: "Already enrolled",
          });

        return await db.enrollStudent({
          studentId: ctx.user.id,
          courseId: input.courseId,
        });
      }),

    getForCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });
        if (course.instructorId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await db.getCourseEnrollments(input.courseId);
      }),
  }),

  // ============ PROGRESS ============
  progress: router({
    record: protectedProcedure
      .input(
        z.object({
          enrollmentId: z.number(),
          lessonId: z.number(),
          watchedDuration: z.number().optional(),
          notes: z.string().optional(),
          completed: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const enrollment = await db.getEnrollmentById(input.enrollmentId);
        if (!enrollment || enrollment.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const existing = await db.getLessonProgress(
          input.enrollmentId,
          input.lessonId
        );
        if (existing) {
          return await db.updateProgress(existing.id, {
            watchedDuration: input.watchedDuration,
            notes: input.notes,
            completedAt: input.completed ? new Date() : existing.completedAt,
          });
        }

        return await db.recordProgress({
          enrollmentId: input.enrollmentId,
          lessonId: input.lessonId,
          watchedDuration: input.watchedDuration,
          notes: input.notes,
          completedAt: input.completed ? new Date() : undefined,
        });
      }),

    getEnrollmentProgress: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const enrollment = await db.getEnrollmentById(input.enrollmentId);
        if (!enrollment || enrollment.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await db.getEnrollmentProgress(input.enrollmentId);
      }),
  }),

  // ============ CERTIFICATES ============
  certificates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getStudentCertificates(ctx.user.id);
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const cert = await db.getCertificateById(input.id);
        if (!cert) throw new TRPCError({ code: "NOT_FOUND" });
        return cert;
      }),
  }),

  // ============ PAYMENTS ============
  payments: router({
    create: protectedProcedure
      .input(
        z.object({
          courseId: z.number(),
          amount: z.string(),
          paymentMethod: z.enum(["mobile_money", "bank_transfer"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const course = await db.getCourseById(input.courseId);
        if (!course) throw new TRPCError({ code: "NOT_FOUND" });

        return await db.createPayment({
          studentId: ctx.user.id,
          courseId: input.courseId,
          amount: parseFloat(input.amount).toString(),
          paymentMethod: input.paymentMethod,
          status: "pending",
        });
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getStudentPayments(ctx.user.id);
    }),
  }),

  // ============ CHAT ============
  chat: router({
    sendMessage: protectedProcedure
      .input(
        z.object({
          courseId: z.number().optional(),
          lessonId: z.number().optional(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.saveChatMessage({
          studentId: ctx.user.id,
          courseId: input.courseId,
          lessonId: input.lessonId,
          role: "user",
          content: input.content,
        });

        try {
          // Generate context-aware response based on user query
          let assistantMessage = "";
          const userQuery = input.content.toLowerCase();

          if (userQuery.includes("what") || userQuery.includes("explain")) {
            assistantMessage =
              "That's a great question! Based on the course content, I can help explain this concept. Could you provide more details about what specifically you'd like to understand?";
          } else if (userQuery.includes("how")) {
            assistantMessage =
              "I can help you with that! The course materials cover this topic. Would you like me to break down the steps or explain a specific part?";
          } else if (
            userQuery.includes("tip") ||
            userQuery.includes("advice")
          ) {
            assistantMessage =
              "Here's a helpful tip for learning this material: Try to relate the concepts to real-world examples. This helps with retention and understanding. What aspect would you like to focus on?";
          } else if (
            userQuery.includes("practice") ||
            userQuery.includes("exercise")
          ) {
            assistantMessage =
              "Great idea! Practicing what you've learned is crucial. Try working through the exercises in the course materials. If you get stuck, feel free to ask me specific questions about the problems.";
          } else if (
            userQuery.includes("stuck") ||
            userQuery.includes("confused") ||
            userQuery.includes("help")
          ) {
            assistantMessage =
              "Don't worry, you're not alone! Learning new concepts takes time. Let's break it down together. What specific part are you struggling with?";
          } else {
            assistantMessage =
              "I'm here to help with your learning! Feel free to ask questions about the course content, and I'll do my best to provide clear explanations and helpful guidance.";
          }

          await db.saveChatMessage({
            studentId: ctx.user.id,
            courseId: input.courseId,
            lessonId: input.lessonId,
            role: "assistant",
            content: assistantMessage,
          });

          return { message: assistantMessage };
        } catch (error) {
          console.error("Chat error:", error);
          const errorMessage =
            "I encountered an issue processing your question. Please try again.";
          return { message: errorMessage };
        }
      }),

    getHistory: protectedProcedure
      .input(
        z.object({
          courseId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await db.getChatHistory(ctx.user.id, input.courseId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
