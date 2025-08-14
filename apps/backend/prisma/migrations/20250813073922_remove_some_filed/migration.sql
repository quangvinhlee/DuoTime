/*
  Warnings:

  - The values [CANCELLED,EXPIRED] on the enum `ReminderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isAnonymous` on the `LoveNote` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReminderStatus_new" AS ENUM ('ACTIVE', 'COMPLETED');
ALTER TABLE "public"."Reminder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Reminder" ALTER COLUMN "status" TYPE "public"."ReminderStatus_new" USING ("status"::text::"public"."ReminderStatus_new");
ALTER TYPE "public"."ReminderStatus" RENAME TO "ReminderStatus_old";
ALTER TYPE "public"."ReminderStatus_new" RENAME TO "ReminderStatus";
DROP TYPE "public"."ReminderStatus_old";
ALTER TABLE "public"."Reminder" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."LoveNote" DROP COLUMN "isAnonymous";
