-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('HEALTH', 'ROMANCE', 'FAMILY', 'DAILY', 'CHORES', 'WORK', 'PERSONAL', 'CELEBRATION', 'GIFT', 'DATE');

-- CreateEnum
CREATE TYPE "public"."ReminderStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."ReminderPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('REMINDER', 'LOVE_NOTE', 'PARTNER_ACTIVITY', 'SYSTEM', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('DATE', 'MOVIE', 'DINNER', 'WALK', 'TRAVEL', 'GIFT', 'SURPRISE', 'ANNIVERSARY', 'BIRTHDAY', 'CASUAL');

-- CreateEnum
CREATE TYPE "public"."BindingStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- CreateTable
CREATE TABLE "public"."PartnerBinding" (
    "id" TEXT NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "status" "public"."BindingStatus" NOT NULL DEFAULT 'PENDING',
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "message" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "PartnerBinding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reminder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "type" "public"."ReminderType" NOT NULL,
    "status" "public"."ReminderStatus" NOT NULL DEFAULT 'ACTIVE',
    "isSecret" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" TEXT,
    "alarmSound" TEXT,
    "vibration" BOOLEAN NOT NULL DEFAULT true,
    "priority" "public"."ReminderPriority" NOT NULL DEFAULT 'MEDIUM',
    "createdById" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reminderId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoveActivity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "location" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoveActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoveNote" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoveNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "reminderNotifications" BOOLEAN NOT NULL DEFAULT true,
    "loveNoteNotifications" BOOLEAN NOT NULL DEFAULT true,
    "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "allowSecretReminders" BOOLEAN NOT NULL DEFAULT true,
    "allowAnonymousNotes" BOOLEAN NOT NULL DEFAULT true,
    "preferredTheme" TEXT NOT NULL DEFAULT 'love',
    "preferredColors" TEXT,
    "defaultReminderTime" TEXT NOT NULL DEFAULT '09:00',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "defaultAlarmSound" TEXT NOT NULL DEFAULT 'default',
    "defaultVibration" BOOLEAN NOT NULL DEFAULT true,
    "snoozeDuration" INTEGER NOT NULL DEFAULT 5,
    "maxSnoozes" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoveStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalRemindersCreated" INTEGER NOT NULL DEFAULT 0,
    "totalRemindersReceived" INTEGER NOT NULL DEFAULT 0,
    "completedReminders" INTEGER NOT NULL DEFAULT 0,
    "activeReminders" INTEGER NOT NULL DEFAULT 0,
    "totalActivities" INTEGER NOT NULL DEFAULT 0,
    "totalLoveNotes" INTEGER NOT NULL DEFAULT 0,
    "receivedLoveNotes" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "daysWithPartner" INTEGER NOT NULL DEFAULT 0,
    "anniversaryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoveStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerBinding_invitationCode_key" ON "public"."PartnerBinding"("invitationCode");

-- CreateIndex
CREATE INDEX "PartnerBinding_invitationCode_idx" ON "public"."PartnerBinding"("invitationCode");

-- CreateIndex
CREATE INDEX "PartnerBinding_senderId_idx" ON "public"."PartnerBinding"("senderId");

-- CreateIndex
CREATE INDEX "PartnerBinding_receiverId_idx" ON "public"."PartnerBinding"("receiverId");

-- CreateIndex
CREATE INDEX "PartnerBinding_status_idx" ON "public"."PartnerBinding"("status");

-- CreateIndex
CREATE INDEX "Reminder_recipientId_status_idx" ON "public"."Reminder"("recipientId", "status");

-- CreateIndex
CREATE INDEX "Reminder_scheduledAt_idx" ON "public"."Reminder"("scheduledAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "public"."Notification"("sentAt");

-- CreateIndex
CREATE INDEX "LoveActivity_createdById_date_idx" ON "public"."LoveActivity"("createdById", "date");

-- CreateIndex
CREATE INDEX "LoveNote_recipientId_isRead_idx" ON "public"."LoveNote"("recipientId", "isRead");

-- CreateIndex
CREATE INDEX "LoveNote_createdAt_idx" ON "public"."LoveNote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "public"."UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LoveStats_userId_key" ON "public"."LoveStats"("userId");

-- AddForeignKey
ALTER TABLE "public"."PartnerBinding" ADD CONSTRAINT "PartnerBinding_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartnerBinding" ADD CONSTRAINT "PartnerBinding_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "public"."Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoveActivity" ADD CONSTRAINT "LoveActivity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoveNote" ADD CONSTRAINT "LoveNote_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoveNote" ADD CONSTRAINT "LoveNote_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoveStats" ADD CONSTRAINT "LoveStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
