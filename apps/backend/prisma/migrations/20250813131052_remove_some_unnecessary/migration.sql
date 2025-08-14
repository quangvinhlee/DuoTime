/*
  Warnings:

  - Added the required column `receiverId` to the `LoveActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."LoveActivity" ADD COLUMN     "receiverId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "LoveActivity_receiverId_status_idx" ON "public"."LoveActivity"("receiverId", "status");
