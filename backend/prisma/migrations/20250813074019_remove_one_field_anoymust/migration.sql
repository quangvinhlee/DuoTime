/*
  Warnings:

  - You are about to drop the column `allowAnonymousNotes` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserPreferences" DROP COLUMN "allowAnonymousNotes";
