/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `WordProgress` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect` on the `WordProgress` table. All the data in the column will be lost.
  - You are about to drop the column `learnedAt` on the `WordProgress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,wordId]` on the table `WordProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `language` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'UA', 'DE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "WordProgress" DROP COLUMN "correct",
DROP COLUMN "incorrect",
DROP COLUMN "learnedAt",
ADD COLUMN     "isLearned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "global_language" "Language" NOT NULL DEFAULT 'UA',
    "curent_language" "Language" NOT NULL DEFAULT 'EN',
    "purposes" TEXT[] DEFAULT ARRAY['none']::TEXT[],
    "current_level" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_userId_key" ON "Setting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WordProgress_userId_wordId_key" ON "WordProgress"("userId", "wordId");

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
