CREATE TABLE IF NOT EXISTS `users` (
    `id` int AUTO_INCREMENT NOT NULL,
    `openId` varchar(64) NOT NULL,
    `name` text,
    `email` varchar(320) NOT NULL,
    `password` varchar(255) NOT NULL,
    `loginMethod` varchar(64),
    `role` enum('user','instructor','admin') NOT NULL DEFAULT 'user',
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    UNIQUE KEY `users_openId_unique` (`openId`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `courses` (
    `id` int AUTO_INCREMENT NOT NULL,
    `instructorId` int NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` longtext,
    `category` varchar(100),
    `level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
    `thumbnail` text,
    `price` decimal(10,2) DEFAULT '0.00',
    `requiresCertificate` boolean DEFAULT true,
    `isPublished` boolean DEFAULT false,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lessons` (
    `id` int AUTO_INCREMENT NOT NULL,
    `courseId` int NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` longtext,
    `videoUrl` text,
    `videoKey` varchar(255),
    `duration` int,
    `transcription` longtext,
    `order` int NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `enrollments` (
    `id` int AUTO_INCREMENT NOT NULL,
    `studentId` int NOT NULL,
    `courseId` int NOT NULL,
    `enrolledAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completedAt` timestamp NULL,
    `certificateId` int,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `progress` (
    `id` int AUTO_INCREMENT NOT NULL,
    `enrollmentId` int NOT NULL,
    `lessonId` int NOT NULL,
    `completedAt` timestamp NULL,
    `watchedDuration` int,
    `notes` longtext,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `certificates` (
    `id` int AUTO_INCREMENT NOT NULL,
    `enrollmentId` int NOT NULL,
    `courseId` int NOT NULL,
    `studentId` int NOT NULL,
    `certificateUrl` text,
    `certificateKey` varchar(255),
    `issuedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `certificateNumber` varchar(100),
    PRIMARY KEY(`id`),
    UNIQUE KEY `certificates_certificateNumber_unique` (`certificateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
    `id` int AUTO_INCREMENT NOT NULL,
    `studentId` int NOT NULL,
    `courseId` int NOT NULL,
    `amount` decimal(10,2) NOT NULL,
    `paymentMethod` enum('mobile_money','bank_transfer') NOT NULL,
    `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
    `transactionId` varchar(255),
    `metadata` json,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chatMessages` (
    `id` int AUTO_INCREMENT NOT NULL,
    `studentId` int NOT NULL,
    `courseId` int,
    `lessonId` int,
    `role` enum('user','assistant') NOT NULL,
    `content` longtext NOT NULL,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
