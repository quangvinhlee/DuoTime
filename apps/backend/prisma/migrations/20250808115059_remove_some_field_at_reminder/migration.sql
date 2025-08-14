/*
  Warnings:

  - You are about to drop the column `alarmSound` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `isSecret` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `vibration` on the `Reminder` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ReminderTargetType" AS ENUM ('FOR_ME', 'FOR_PARTNER', 'FOR_BOTH');

-- AlterTable
ALTER TABLE "public"."Reminder" DROP COLUMN "alarmSound",
DROP COLUMN "isSecret",
DROP COLUMN "priority",
DROP COLUMN "vibration",
ADD COLUMN     "targetType" "public"."ReminderTargetType" NOT NULL DEFAULT 'FOR_ME',
ALTER COLUMN "recipientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "pushToken" TEXT;

-- DropEnum
DROP TYPE "public"."ReminderPriority";

-- CreateIndex
CREATE INDEX "Reminder_createdById_targetType_idx" ON "public"."Reminder"("createdById", "targetType");
