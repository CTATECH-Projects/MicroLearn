-- AlterTable
ALTER TABLE "user_progress" ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_streaks" ADD COLUMN     "weekly_goal" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "weekly_lessons_completed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weekly_reset_date" TIMESTAMP(3);
