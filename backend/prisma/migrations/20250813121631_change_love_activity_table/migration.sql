-- CreateEnum
CREATE TYPE "public"."ActivityStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."LoveActivity" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "confirmedById" TEXT,
ADD COLUMN     "status" "public"."ActivityStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "LoveActivity_createdById_status_idx" ON "public"."LoveActivity"("createdById", "status");

-- AddForeignKey
ALTER TABLE "public"."LoveActivity" ADD CONSTRAINT "LoveActivity_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
