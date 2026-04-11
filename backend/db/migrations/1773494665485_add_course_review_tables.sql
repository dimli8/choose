-- Migration: Add course review platform tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add role column to Users if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Users' AND column_name = 'role'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'student';
  END IF;
END $$;

-- Teachers table
CREATE TABLE IF NOT EXISTS "Teachers" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "college" TEXT NOT NULL,
  "title" TEXT,
  "avatar_url" TEXT,
  "bio" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Courses table
CREATE TABLE IF NOT EXISTS "Courses" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL UNIQUE,
  "college" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "teacher_id" TEXT REFERENCES "Teachers"("id"),
  "description" TEXT,
  "image_url" TEXT,
  "credits" INTEGER DEFAULT 2,
  "avg_rating" DECIMAL(3,2) DEFAULT 0,
  "avg_grading" DECIMAL(3,2) DEFAULT 0,
  "avg_workload" DECIMAL(3,2) DEFAULT 0,
  "avg_recommend" DECIMAL(3,2) DEFAULT 0,
  "review_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS "Reviews" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "course_id" TEXT NOT NULL REFERENCES "Courses"("id"),
  "user_id" TEXT NOT NULL REFERENCES "Users"("id"),
  "is_anonymous" BOOLEAN DEFAULT TRUE,
  "content" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "grading" INTEGER NOT NULL,
  "workload" INTEGER NOT NULL,
  "recommend" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "like_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Review Likes table
CREATE TABLE IF NOT EXISTS "ReviewLikes" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "review_id" TEXT NOT NULL REFERENCES "Reviews"("id"),
  "user_id" TEXT NOT NULL REFERENCES "Users"("id"),
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("review_id", "user_id")
);

-- Comments table
CREATE TABLE IF NOT EXISTS "Comments" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "review_id" TEXT NOT NULL REFERENCES "Reviews"("id"),
  "user_id" TEXT NOT NULL REFERENCES "Users"("id"),
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Reports table
CREATE TABLE IF NOT EXISTS "Reports" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "review_id" TEXT NOT NULL REFERENCES "Reviews"("id"),
  "user_id" TEXT NOT NULL REFERENCES "Users"("id"),
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Seed sample teachers
INSERT INTO "Teachers" ("id", "name", "college", "title", "avatar_url") VALUES
  ('t1', '王建国', '理学院', '教授', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80'),
  ('t2', '李晓梅', '经济管理学院', '副教授', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80'),
  ('t3', '张志远', '体育部', '讲师', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80'),
  ('t4', '陈雨薇', '外国语学院', '副教授', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80'),
  ('t5', '刘明远', '计算机学院', '教授', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80'),
  ('t6', '赵静', '人文学院', '讲师', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80')
ON CONFLICT ("id") DO NOTHING;

-- Seed sample courses
INSERT INTO "Courses" ("id", "name", "code", "college", "type", "teacher_id", "description", "image_url", "credits", "avg_rating", "avg_grading", "avg_workload", "avg_recommend", "review_count") VALUES
  ('c1', '高等数学 A', 'MA101', '理学院', '通识课', 't1', '面向理工科学生的高等数学基础课程，涵盖微积分、线性代数等核心内容。', 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?w=600&q=80', 4, 4.2, 4.0, 3.0, 4.5, 342),
  ('c2', '管理学原理', 'MG201', '经济管理学院', '专选课', 't2', '系统介绍管理学基本理论与实践，结合案例分析培养管理思维。', 'https://images.unsplash.com/photo-1646579886135-068c73800308?w=600&q=80', 3, 4.7, 5.0, 2.0, 5.0, 218),
  ('c3', '羽毛球（初级）', 'PE105', '体育部', '体育课', 't3', '面向零基础学生的羽毛球入门课程，轻松愉快，强身健体。', 'https://images.unsplash.com/photo-1622365070739-8c71a665353c?w=600&q=80', 1, 4.9, 5.0, 1.0, 5.0, 567),
  ('c4', '大学英语（四级强化）', 'EN102', '外国语学院', '通识课', 't4', '针对四六级考试的强化训练课程，提升英语综合能力。', 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=80', 3, 3.8, 4.0, 4.0, 3.0, 189),
  ('c5', '数据结构与算法', 'CS201', '计算机学院', '专选课', 't5', '计算机专业核心课程，深入讲解常用数据结构和算法设计思想。', 'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=600&q=80', 4, 4.3, 3.8, 4.5, 4.2, 156),
  ('c6', '中国现代文学', 'CH301', '人文学院', '通识课', 't6', '系统梳理中国现代文学发展脉络，品读经典作品，感受文学魅力。', 'https://images.unsplash.com/photo-1567923227475-692076a6e26e?w=600&q=80', 2, 4.5, 4.5, 2.5, 4.8, 203),
  ('c7', '篮球（中级）', 'PE201', '体育部', '体育课', 't3', '适合有一定基础的学生，系统训练篮球技术与战术。', 'https://images.unsplash.com/photo-1716041040048-228dbae7b6ba?w=600&q=80', 1, 4.6, 4.8, 2.0, 4.7, 289),
  ('c8', '微观经济学', 'EC101', '经济管理学院', '通识课', 't2', '经济学入门课程，介绍供需理论、市场结构等基本概念。', 'https://images.unsplash.com/photo-1597570889212-97f48e632dad?w=600&q=80', 3, 4.1, 3.9, 3.5, 4.0, 178)
ON CONFLICT ("code") DO NOTHING;
