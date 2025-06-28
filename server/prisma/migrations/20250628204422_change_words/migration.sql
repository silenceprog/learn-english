/*
  Warnings:

  - You are about to drop the `WordProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WordTaskType" AS ENUM ('TRANSLATION', 'MATCHING', 'LISTENING');

-- DropForeignKey
ALTER TABLE "WordProgress" DROP CONSTRAINT "WordProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordProgress" DROP CONSTRAINT "WordProgress_wordId_fkey";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "isLearned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalProgress" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "WordProgress";

-- CreateTable
CREATE TABLE "WordTaskProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "taskType" "WordTaskType" NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WordTaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordTaskProgress_userId_wordId_taskType_key" ON "WordTaskProgress"("userId", "wordId", "taskType");

-- AddForeignKey
ALTER TABLE "WordTaskProgress" ADD CONSTRAINT "WordTaskProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordTaskProgress" ADD CONSTRAINT "WordTaskProgress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
