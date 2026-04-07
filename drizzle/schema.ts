import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Internal string identifier used mostly for sessions. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "instructor", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Courses table - stores course information
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  instructorId: int("instructorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  category: varchar("category", { length: 100 }),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).default("beginner"),
  thumbnail: text("thumbnail"), // CDN URL
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  requiresCertificate: boolean("requiresCertificate").default(true),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Lessons table - stores individual lessons within courses
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  videoUrl: text("videoUrl"), // CDN URL
  videoKey: varchar("videoKey", { length: 255 }), // S3 key for reference
  duration: int("duration"), // in seconds
  transcription: longtext("transcription"),
  order: int("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Enrollments table - tracks student enrollment in courses
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseId: int("courseId").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  certificateId: int("certificateId"),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Progress table - tracks lesson completion for students
 */
export const progress = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  lessonId: int("lessonId").notNull(),
  completedAt: timestamp("completedAt"),
  watchedDuration: int("watchedDuration"), // in seconds
  notes: longtext("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = typeof progress.$inferInsert;

/**
 * Certificates table - stores generated certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  courseId: int("courseId").notNull(),
  studentId: int("studentId").notNull(),
  certificateUrl: text("certificateUrl"), // CDN URL
  certificateKey: varchar("certificateKey", { length: 255 }), // S3 key
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  certificateNumber: varchar("certificateNumber", { length: 100 }).unique(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Payments table - tracks payment transactions
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseId: int("courseId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["mobile_money", "bank_transfer"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  transactionId: varchar("transactionId", { length: 255 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Chat Messages table - stores AI chatbot conversations
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  courseId: int("courseId"),
  lessonId: int("lessonId"),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: longtext("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;