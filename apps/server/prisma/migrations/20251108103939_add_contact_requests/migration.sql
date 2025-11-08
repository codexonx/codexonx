-- CreateEnum
CREATE TYPE "ContactTopic" AS ENUM ('DEMO', 'SALES', 'SUPPORT', 'PARTNERSHIP', 'PRESS', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "topic" "ContactTopic" NOT NULL,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "status" "ContactRequestStatus" NOT NULL DEFAULT 'OPEN',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);
