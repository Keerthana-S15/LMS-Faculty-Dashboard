-- ---------------------------------------------------------------------------
-- G Care LMS — faculty dashboard schema
-- Run with:  mysql -u root -p < server/src/db/schema.sql
-- or via:    npm run db:migrate   (from the server/ folder)
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `gcare_lms`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `gcare_lms`;

-- --------------------------------------------------------------- faculty ---
CREATE TABLE IF NOT EXISTS `faculty` (
  `id`                     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`                   VARCHAR(120)  NOT NULL,
  `avatar_url`             VARCHAR(512)  NULL,
  `role`                   VARCHAR(60)   NOT NULL DEFAULT 'Faculty',
  `department`             VARCHAR(120)  NULL,
  `college`                VARCHAR(160)  NULL,
  `email`                  VARCHAR(160)  NOT NULL,
  `phone`                  VARCHAR(40)   NULL,
  `location`               VARCHAR(160)  NULL,
  `employee_id`            VARCHAR(60)   NULL,
  `join_date`              VARCHAR(40)   NULL,
  `qualification`          VARCHAR(160)  NULL,
  `designation`            VARCHAR(120)  NULL,
  `experience`             VARCHAR(80)   NULL,
  `teaching_since`         VARCHAR(20)   NULL,
  `about`                  TEXT          NULL,
  `live_classes_conducted` INT UNSIGNED  NOT NULL DEFAULT 0,
  `published_materials`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_faculty_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------- courses ---
CREATE TABLE IF NOT EXISTS `courses` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(160) NOT NULL,
  `program`    VARCHAR(120) NULL,
  `semester`   VARCHAR(60)  NULL,
  `students`   INT UNSIGNED NOT NULL DEFAULT 0,
  `status`     ENUM('Active','Draft') NOT NULL DEFAULT 'Active',
  `image`      VARCHAR(512) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_courses_status` (`status`),
  KEY `idx_courses_semester` (`semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------- students ---
CREATE TABLE IF NOT EXISTS `students` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(120) NOT NULL,
  `roll`           VARCHAR(40)  NOT NULL,
  `course`         VARCHAR(120) NULL,
  `batch`          VARCHAR(60)  NULL,
  `email`          VARCHAR(160) NULL,
  `phone`          VARCHAR(40)  NULL,
  `gender`         ENUM('Male','Female','Other') NOT NULL DEFAULT 'Female',
  `status`         ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  `admission_year` SMALLINT UNSIGNED NOT NULL DEFAULT 2023,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_students_roll` (`roll`),
  KEY `idx_students_course_batch` (`course`, `batch`),
  KEY `idx_students_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------- live_classes ---
CREATE TABLE IF NOT EXISTS `live_classes` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`        VARCHAR(160) NOT NULL,
  `course`       VARCHAR(160) NOT NULL,
  `year`         VARCHAR(40)  NULL,
  `batch`        VARCHAR(60)  NULL,
  `room`         VARCHAR(60)  NULL,
  `start_at`     DATETIME     NOT NULL,
  `end_at`       DATETIME     NOT NULL,
  `meeting_link` VARCHAR(512) NULL,
  `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_live_classes_start` (`start_at`),
  KEY `idx_live_classes_course` (`course`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------- assignments ---
CREATE TABLE IF NOT EXISTS `assignments` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`           VARCHAR(160) NOT NULL,
  `course`          VARCHAR(160) NOT NULL,
  `meta`            VARCHAR(120) NULL,
  `description`     TEXT         NULL,
  `due_at`          DATETIME     NOT NULL,
  `max_marks`       INT UNSIGNED NOT NULL DEFAULT 20,
  `total_students`  INT UNSIGNED NOT NULL DEFAULT 30,
  `submitted_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `status`          ENUM('Draft','Pending Review','Reviewed') NOT NULL DEFAULT 'Draft',
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assignments_status` (`status`),
  KEY `idx_assignments_due` (`due_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------- quizzes ---
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(160) NOT NULL,
  `course`        VARCHAR(160) NOT NULL,
  `meta`          VARCHAR(120) NULL,
  `duration_mins` INT UNSIGNED NOT NULL DEFAULT 20,
  `status`        ENUM('Published','Scheduled','Draft') NOT NULL DEFAULT 'Draft',
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quizzes_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id`       INT UNSIGNED NOT NULL,
  `position`      INT UNSIGNED NOT NULL DEFAULT 0,
  `text`          TEXT         NULL,
  `options`       JSON         NOT NULL,
  `correct_index` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `marks`         INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_quiz_questions_quiz` (`quiz_id`, `position`),
  CONSTRAINT `fk_quiz_questions_quiz` FOREIGN KEY (`quiz_id`)
    REFERENCES `quizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------- study materials ---
CREATE TABLE IF NOT EXISTS `materials` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(200) NOT NULL,
  `course`      VARCHAR(160) NOT NULL,
  `meta`        VARCHAR(120) NULL,
  `topic`       VARCHAR(160) NULL,
  `type`        ENUM('Document','Video','Audio','Link') NOT NULL DEFAULT 'Document',
  `ext`         VARCHAR(20)  NULL,
  `size_label`  VARCHAR(40)  NOT NULL DEFAULT '-',
  `url`         VARCHAR(1024) NULL,
  `uploaded_at` DATETIME     NOT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_materials_type` (`type`),
  KEY `idx_materials_course` (`course`),
  KEY `idx_materials_uploaded` (`uploaded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------- announcements ---
CREATE TABLE IF NOT EXISTS `announcements` (
  `id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`     VARCHAR(200) NOT NULL,
  `body`      TEXT         NULL,
  `audience`  VARCHAR(120) NOT NULL DEFAULT 'All Students',
  `priority`  ENUM('Normal','Important','Urgent') NOT NULL DEFAULT 'Normal',
  `status`    ENUM('Published','Scheduled','Draft') NOT NULL DEFAULT 'Published',
  `pinned`    TINYINT(1)   NOT NULL DEFAULT 0,
  `posted_at` DATETIME     NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_announcements_status` (`status`),
  KEY `idx_announcements_posted` (`posted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------ attendance ---
CREATE TABLE IF NOT EXISTS `attendance` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `course`        VARCHAR(160) NOT NULL,
  `batch`         VARCHAR(60)  NOT NULL,
  `session_date`  DATE         NOT NULL,
  `student_id`    INT UNSIGNED NOT NULL,
  `session`       VARCHAR(10)  NOT NULL DEFAULT 's1',
  `status`        ENUM('Present','Absent','Late') NULL,
  `check_in`      VARCHAR(20)  NULL,
  `check_out`     VARCHAR(20)  NULL,
  `remarks`       VARCHAR(255) NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance_register` (`course`, `batch`, `session_date`, `student_id`),
  KEY `idx_attendance_date` (`session_date`),
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`)
    REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------- messages / conversations ---
CREATE TABLE IF NOT EXISTS `conversations` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `role`       VARCHAR(60)  NULL,
  `meta`       VARCHAR(160) NULL,
  `is_group`   TINYINT(1)   NOT NULL DEFAULT 0,
  `unread`     INT UNSIGNED NOT NULL DEFAULT 0,
  `student_ref` VARCHAR(40) NULL,
  `email`      VARCHAR(160) NULL,
  `phone`      VARCHAR(40)  NULL,
  `last_text`  VARCHAR(500) NULL,
  `last_label` VARCHAR(40)  NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversations_group` (`is_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `messages` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED NOT NULL,
  `sender`          ENUM('me','them') NOT NULL,
  `text`            TEXT         NOT NULL,
  `time_label`      VARCHAR(40)  NULL,
  `sent_at`         DATETIME     NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_messages_conversation` (`conversation_id`, `sent_at`),
  CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversation_id`)
    REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `conversation_files` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED NOT NULL,
  `name`            VARCHAR(255) NOT NULL,
  `size_label`      VARCHAR(40)  NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation_files_conversation` (`conversation_id`),
  CONSTRAINT `fk_conversation_files_conversation` FOREIGN KEY (`conversation_id`)
    REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Counter for "sent messages this month" on the Messages page.
CREATE TABLE IF NOT EXISTS `message_stats` (
  `id`            TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `sent_baseline` INT UNSIGNED NOT NULL DEFAULT 156,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
