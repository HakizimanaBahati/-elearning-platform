# E-Learning Platform API Documentation

## Overview

This document provides comprehensive API documentation for the E-Learning Platform. All APIs use tRPC and are accessible via `/api/trpc/{router}.{procedure}`.

**Base URL:** `http://localhost:3000/api/trpc`

**Authentication:** Session-based using cookies (`session_token`)

---

## API Index

| Router                        | Procedures |
| ----------------------------- | ---------- |
| [system](#system)             | 2          |
| [auth](#auth)                 | 5          |
| [admin](#admin)               | 12         |
| [courses](#courses)           | 6          |
| [lessons](#lessons)           | 6          |
| [modules](#modules)           | 5          |
| [enrollments](#enrollments)   | 4          |
| [progress](#progress)         | 3          |
| [certificates](#certificates) | 3          |
| [payments](#payments)         | 3          |
| [chat](#chat)                 | 3          |

---

## Authentication Levels

| Level                | Description                         |
| -------------------- | ----------------------------------- |
| `publicProcedure`    | No authentication required          |
| `protectedProcedure` | Requires valid session cookie       |
| `adminProcedure`     | Requires admin role + valid session |

---

## system

### health

Check API health status.

**Auth:** Public  
**Type:** Query

**Input:**

```typescript
{
  timestamp: number; // Client timestamp (cannot be negative)
}
```

**Output:**

```typescript
{
  ok: boolean;
}
```

**Example:** `/api/trpc/system.health?input={"timestamp":1699900000}`

---

### notifyOwner

Send notification to platform owner.

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  title: string; // Min 1 character
  content: string; // Min 1 character
}
```

**Output:**

```typescript
{
  success: boolean;
}
```

---

## auth

### me

Get current authenticated user.

**Auth:** Public  
**Type:** Query

**Output:** `User` object or `null`

---

### logout

Log out current user.

**Auth:** Public  
**Type:** Mutation

**Output:**

```typescript
{
  success: true;
}
```

---

### login

Authenticate user and create session.

**Auth:** Public  
**Type:** Mutation

**Input:**

```typescript
{
  email: string; // Valid email format
  password: string;
}
```

**Output:** `User` object

**Errors:**

- `UNAUTHORIZED` - Invalid credentials

---

### register

Register new user account.

**Auth:** Public  
**Type:** Mutation

**Input:**

```typescript
{
  email: string              // Valid email format
  password: string          // Min 6 characters
  name: string               // Min 2 characters
  role?: "user" | "instructor" | "admin"  // Default: "user"
}
```

**Output:** `User` object

**Errors:**

- `CONFLICT` - Email already exists

---

### updateProfile

Update current user's profile.

**Auth:** Protected  
**Type:** Mutation

**Input:**

```typescript
{
  name?: string  // Min 2 characters
}
```

**Output:** Updated `User` object

---

## admin

### getAllUsers

Get all users in the system.

**Auth:** Admin  
**Type:** Query

**Output:** Array of `User` objects

---

### createUser

Create a new user (admin only).

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  name: string; // Min 2 characters
  email: string; // Valid email format
  password: string; // Min 6 characters
  role: "user" | "instructor" | "admin";
}
```

**Output:** Created `User` object

**Errors:**

- `CONFLICT` - Email already exists

---

### updateUserRole

Update a user's role.

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  userId: number;
  role: "user" | "instructor" | "admin";
}
```

**Output:** Updated `User` object

---

### deleteUser

Delete a user.

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  userId: number;
}
```

**Output:** Success response

---

### getAllCourses

Get all courses (including unpublished).

**Auth:** Admin  
**Type:** Query

**Output:** Array of `Course` objects

---

### deleteCourse

Delete a course.

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  courseId: number;
}
```

**Output:** Success response

---

### getStats

Get platform statistics.

**Auth:** Admin  
**Type:** Query

**Output:**

```typescript
{
  totalUsers: number;
  totalInstructors: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalRevenue: number; // Sum of completed payments
}
```

---

### getAllEnrollments

Get all enrollments with details.

**Auth:** Admin  
**Type:** Query

**Output:** Array of `Enrollment` objects with details

---

### getAllPayments

Get all payments.

**Auth:** Admin  
**Type:** Query

**Output:** Array of `Payment` objects

---

### updatePaymentStatus

Update payment status.

**Auth:** Admin  
**Type:** Mutation

**Input:**

```typescript
{
  paymentId: number;
  status: "completed" | "pending" | "failed";
}
```

**Output:** Updated `Payment` object

---

### getAllCertificates

Get all certificates.

**Auth:** Admin  
**Type:** Query

**Output:** Array of `Certificate` objects

---

## courses

### list

Get all published courses.

**Auth:** Public  
**Type:** Query

**Output:** Array of published `Course` objects

---

### getById

Get course by ID.

**Auth:** Public  
**Type:** Query

**Input:**

```typescript
{
  id: number;
}
```

**Output:** `Course` object

**Errors:**

- `NOT_FOUND` - Course not found

---

### getByInstructor

Get courses by current instructor.

**Auth:** Protected (instructor/admin)  
**Type:** Query

**Output:** Array of `Course` objects by instructor

**Errors:**

- `FORBIDDEN` - Not an instructor or admin

---

### create

Create a new course.

**Auth:** Protected (instructor/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  title: string                              // Required
  description?: string
  category?: string
  level?: "beginner" | "intermediate" | "advanced"
  thumbnail?: string                         // URL
  price?: string                             // As string, default "0"
}
```

**Output:** Created `Course` object

**Errors:**

- `FORBIDDEN` - Not an instructor or admin

---

### update

Update an existing course.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number
  title?: string
  description?: string
  category?: string
  level?: "beginner" | "intermediate" | "advanced"
  thumbnail?: string
  price?: string
  isPublished?: boolean
}
```

**Output:** Updated `Course` object

**Errors:**

- `NOT_FOUND` - Course not found
- `FORBIDDEN` - Not authorized

---

### delete

Delete a course.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number;
}
```

**Output:**

```typescript
{
  success: true;
}
```

**Errors:**

- `NOT_FOUND` - Course not found
- `FORBIDDEN` - Not authorized

---

## lessons

### getByCourse

Get all lessons for a course.

**Auth:** Public  
**Type:** Query

**Input:**

```typescript
{
  courseId: number;
}
```

**Output:** Array of `Lesson` objects

---

### getById

Get lesson by ID.

**Auth:** Public  
**Type:** Query

**Input:**

```typescript
{
  id: number;
}
```

**Output:** `Lesson` object

**Errors:**

- `NOT_FOUND` - Lesson not found

---

### create

Create a new lesson.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  courseId: number
  title: string                     // Min 1 character
  description?: string
  lessonType?: "video" | "document"  // Default: "video"
  moduleId?: number
  videoUrl?: string
  videoKey?: string
  content?: string
  duration?: number                 // In seconds
  order: number
}
```

**Output:** Created `Lesson` object

**Errors:**

- `NOT_FOUND` - Course not found
- `FORBIDDEN` - Not authorized

---

### update

Update a lesson.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number
  title?: string
  description?: string
  videoUrl?: string
  videoKey?: string
  duration?: number
  transcription?: string
  order?: number
}
```

**Output:** Updated `Lesson` object

**Errors:**

- `NOT_FOUND` - Lesson or course not found
- `FORBIDDEN` - Not authorized

---

### delete

Delete a lesson.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number;
}
```

**Output:**

```typescript
{
  success: true;
}
```

**Errors:**

- `NOT_FOUND` - Lesson or course not found
- `FORBIDDEN` - Not authorized

---

## modules

### getByCourse

Get all modules for a course.

**Auth:** Protected  
**Type:** Query

**Input:**

```typescript
{
  courseId: number;
}
```

**Output:** Array of `Module` objects

---

### create

Create a new module.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  courseId: number
  title: string           // Min 1 character
  description?: string
  order: number
}
```

**Output:** Created `Module` object

**Errors:**

- `NOT_FOUND` - Course not found
- `FORBIDDEN` - Not authorized

---

### update

Update a module.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number
  title?: string           // Min 1 character
  description?: string
  order?: number
}
```

**Output:** Updated `Module` object

**Errors:**

- `NOT_FOUND` - Module or course not found
- `FORBIDDEN` - Not authorized

---

### delete

Delete a module.

**Auth:** Protected (course owner/admin)  
**Type:** Mutation

**Input:**

```typescript
{
  id: number;
}
```

**Output:**

```typescript
{
  success: true;
}
```

**Errors:**

- `NOT_FOUND` - Module or course not found
- `FORBIDDEN` - Not authorized

---

## enrollments

### list

Get current user's enrollments.

**Auth:** Protected  
**Type:** Query

**Output:** Array of `Enrollment` objects

---

### enroll

Enroll in a course.

**Auth:** Protected  
**Type:** Mutation

**Input:**

```typescript
{
  courseId: number;
}
```

**Output:** Created `Enrollment` object

**Errors:**

- `NOT_FOUND` - Course not found
- `CONFLICT` - Already enrolled

---

### getForCourse

Get enrollments for a course (instructor view).

**Auth:** Protected (course owner/admin)  
**Type:** Query

**Input:**

```typescript
{
  courseId: number;
}
```

**Output:** Array of `Enrollment` objects for the course

**Errors:**

- `NOT_FOUND` - Course not found
- `FORBIDDEN` - Not authorized

---

## progress

### record

Record lesson progress.

**Auth:** Protected  
**Type:** Mutation

**Input:**

```typescript
{
  enrollmentId: number
  lessonId: number
  watchedDuration?: number     // In seconds
  notes?: string
  completed?: boolean
}
```

**Output:** `Progress` object

**Errors:**

- `FORBIDDEN` - Not the enrollment owner

---

### getEnrollmentProgress

Get progress for an enrollment.

**Auth:** Protected  
**Type:** Query

**Input:**

```typescript
{
  enrollmentId: number;
}
```

**Output:** Array of `Progress` objects

**Errors:**

- `FORBIDDEN` - Not the enrollment owner

---

## certificates

### list

Get current user's certificates.

**Auth:** Protected  
**Type:** Query

**Output:** Array of `Certificate` objects

---

### getById

Get certificate by ID.

**Auth:** Public  
**Type:** Query

**Input:**

```typescript
{
  id: number;
}
```

**Output:** `Certificate` object

**Errors:**

- `NOT_FOUND` - Certificate not found

---

## payments

### create

Create a payment.

**Auth:** Protected  
**Type:** Mutation

**Input:**

```typescript
{
  courseId: number
  amount: string
  paymentMethod: "mtn_mobile_money" | "airtel_money" | "equity_bank"
  paymentType?: "course" | "certificate"  // Default: "course"
}
```

**Output:** Created `Payment` object

**Errors:**

- `NOT_FOUND` - Course not found / Not enrolled (for certificate)
- `BAD_REQUEST` - Course requirements not met

---

### list

Get current user's payments.

**Auth:** Protected  
**Type:** Query

**Output:** Array of `Payment` objects

---

## chat

### sendMessage

Send a chat message and get AI response.

**Auth:** Protected  
**Type:** Mutation

**Input:**

```typescript
{
  courseId?: number
  lessonId?: number
  content: string  // Min 1 character
}
```

**Output:**

```typescript
{
  message: string; // AI response
}
```

---

### getHistory

Get chat history.

**Auth:** Protected  
**Type:** Query

**Input:**

```typescript
{
  courseId?: number
}
```

**Output:** Array of `ChatMessage` objects

---

## Data Models

### User

```typescript
{
  id: number;
  openId: string;
  email: string;
  name: string | null;
  role: "user" | "instructor" | "admin";
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Course

```typescript
{
  id: number;
  instructorId: number;
  title: string;
  description: string | null;
  category: string | null;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string | null;
  price: string;
  isPublished: boolean;
  requiresCertificate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Lesson

```typescript
{
  id: number;
  courseId: number;
  moduleId: number | null;
  title: string;
  description: string | null;
  lessonType: "video" | "document";
  videoUrl: string | null;
  videoKey: string | null;
  content: string | null;
  duration: number | null;
  transcription: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Module

```typescript
{
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enrollment

```typescript
{
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: Date;
}
```

### Progress

```typescript
{
  id: number;
  enrollmentId: number;
  lessonId: number;
  watchedDuration: number | null;
  notes: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Certificate

```typescript
{
  id: number;
  studentId: number;
  courseId: number;
  issuedAt: Date;
}
```

### Payment

```typescript
{
  id: number;
  studentId: number;
  courseId: number;
  amount: string;
  paymentMethod: "mtn_mobile_money" | "airtel_money" | "equity_bank";
  paymentType: "course" | "certificate";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}
```

### ChatMessage

```typescript
{
  id: number;
  studentId: number;
  courseId: number | null;
  lessonId: number | null;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}
```

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Invalid credentials   |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found                            |
| 409  | Conflict - Resource already exists   |
| 500  | Internal Server Error                |

---

## Example Usage

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{"json": {"email": "user@example.com", "password": "password123"}}'

# Get courses (public)
curl http://localhost:3000/api/trpc/courses.list

# Create course (authenticated - requires cookie)
curl -X POST http://localhost:3000/api/trpc/courses.create \
  -H "Content-Type: application/json" \
  -b "session_token=your_session_token" \
  -d '{"json": {"title": "My Course", "description": "Course description"}}'
```

### JavaScript/TypeScript

```typescript
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./server/routers";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

// Public query
const courses = await trpc.courses.list.query();

// Authenticated mutation
const user = await trpc.auth.login.mutate({
  email: "user@example.com",
  password: "password123",
});

// Create course
const course = await trpc.courses.create.mutate({
  title: "New Course",
  description: "Course description",
  price: "49.99",
});
```
