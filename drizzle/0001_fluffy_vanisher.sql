CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`courseId` int NOT NULL,
	`studentId` int NOT NULL,
	`certificateUrl` text,
	`certificateKey` varchar(255),
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`certificateNumber` varchar(100),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int,
	`lessonId` int,
	`role` enum('user','assistant') NOT NULL,
	`content` longtext NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instructorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`category` varchar(100),
	`level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
	`thumbnail` text,
	`price` decimal(10,2) DEFAULT '0',
	`requiresCertificate` boolean DEFAULT true,
	`isPublished` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`certificateId` int,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`videoUrl` text,
	`videoKey` varchar(255),
	`duration` int,
	`transcription` longtext,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` enum('mobile_money','bank_transfer') NOT NULL,
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`transactionId` varchar(255),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completedAt` timestamp,
	`watchedDuration` int,
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
