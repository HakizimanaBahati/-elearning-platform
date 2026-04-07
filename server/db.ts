import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courses,
  lessons,
  modules,
  enrollments,
  progress,
  certificates,
  payments,
  chatMessages,
  InsertCourse,
  InsertLesson,
  InsertModule,
  InsertEnrollment,
  InsertProgress,
  InsertCertificate,
  InsertPayment,
  InsertChatMessage,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(users).values(data);
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email!))
    .limit(1);
  return result[0];
}

// ============ COURSES ============

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(data);
  return result;
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCoursesByInstructor(instructorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(courses)
    .where(eq(courses.instructorId, instructorId))
    .orderBy(desc(courses.createdAt));
}

export async function getPublishedCourses() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(courses)
    .where(eq(courses.isPublished, true))
    .orderBy(desc(courses.createdAt));
}

export async function updateCourse(id: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id));
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(courses).where(eq(courses.id, id));
}

// ============ LESSONS ============

export async function createLesson(data: InsertLesson) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(lessons).values(data);
}

export async function getLessonById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLessonsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.order));
}

export async function updateLesson(id: number, data: Partial<InsertLesson>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(lessons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(lessons.id, id));
}

export async function deleteLesson(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(lessons).where(eq(lessons.id, id));
}

// ============ MODULES ============

export async function createModule(data: InsertModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(modules).values(data);
}

export async function getModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(modules)
    .where(eq(modules.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getModulesByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, courseId))
    .orderBy(asc(modules.order));
}

export async function updateModule(id: number, data: Partial<InsertModule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(modules)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(modules.id, id));
}

export async function deleteModule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(lessons)
    .set({ moduleId: null })
    .where(eq(lessons.moduleId, id));
  return await db.delete(modules).where(eq(modules.id, id));
}

// ============ ENROLLMENTS ============

export async function enrollStudent(data: InsertEnrollment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(enrollments).values(data);
}

export async function getEnrollmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentEnrollments(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId))
    .orderBy(desc(enrollments.enrolledAt));
}

export async function getCourseEnrollments(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId));
}

export async function getStudentEnrollmentForCourse(
  studentId: number,
  courseId: number
) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.courseId, courseId)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateEnrollment(
  id: number,
  data: Partial<InsertEnrollment>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(enrollments).set(data).where(eq(enrollments.id, id));
}

// ============ PROGRESS ============

export async function recordProgress(data: InsertProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(progress).values(data);
}

export async function getProgressById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(progress)
    .where(eq(progress.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEnrollmentProgress(enrollmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(progress)
    .where(eq(progress.enrollmentId, enrollmentId));
}

export async function getLessonProgress(
  enrollmentId: number,
  lessonId: number
) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.enrollmentId, enrollmentId),
        eq(progress.lessonId, lessonId)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProgress(
  id: number,
  data: Partial<InsertProgress>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(progress)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(progress.id, id));
}

// ============ CERTIFICATES ============

export async function createCertificate(data: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(certificates).values(data);
}

export async function getCertificateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentCertificates(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(certificates)
    .where(eq(certificates.studentId, studentId));
}

export async function getEnrollmentCertificate(enrollmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.enrollmentId, enrollmentId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PAYMENTS ============

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(payments).values(data);
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentPayments(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(payments)
    .where(eq(payments.studentId, studentId));
}

export async function updatePayment(id: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(payments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(payments.id, id));
}

export async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function updatePaymentStatus(
  id: number,
  status: "completed" | "pending" | "failed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .update(payments)
    .set({ status, updatedAt: new Date() })
    .where(eq(payments.id, id));
}

// ============ CHAT MESSAGES ============

export async function saveChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(chatMessages).values(data);
}

export async function getChatHistory(studentId: number, courseId?: number) {
  const db = await getDb();
  if (!db) return [];
  return courseId
    ? await db
        .select()
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.studentId, studentId),
            eq(chatMessages.courseId, courseId)
          )
        )
        .orderBy(desc(chatMessages.createdAt))
    : await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.studentId, studentId))
        .orderBy(desc(chatMessages.createdAt));
}

// ============ ADMIN FUNCTIONS ============

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(
  userId: number,
  role: "user" | "instructor" | "admin"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));
  return { success: true };
}

export async function updateUser(userId: number, data: { name?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId));
  const [updated] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return updated;
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}

export async function getAllCoursesForAdmin() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(courses).orderBy(desc(courses.createdAt));
}

export async function getAllEnrollments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(enrollments);
}

export async function getEnrollmentsWithDetails() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select({
      id: enrollments.id,
      studentId: enrollments.studentId,
      courseId: enrollments.courseId,
      enrolledAt: enrollments.enrolledAt,
      completedAt: enrollments.completedAt,
      certificateId: enrollments.certificateId,
      studentName: users.name,
      studentEmail: users.email,
      courseTitle: courses.title,
    })
    .from(enrollments)
    .leftJoin(users, eq(enrollments.studentId, users.id))
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .orderBy(desc(enrollments.enrolledAt));
}

export async function getAllCertificates() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(certificates)
    .orderBy(desc(certificates.issuedAt));
}
