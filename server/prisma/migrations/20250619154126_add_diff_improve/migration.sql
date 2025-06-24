/*
  Warnings:

  - The `level` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `curent_language` on the `Setting` table. All the data in the column will be lost.
  - The `purposes` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `current_level` column on the `Setting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `level` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('NONE', 'EXAM', 'TRAVEL', 'WORK');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('NONE', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_userId_fkey";

-- DropForeignKey
ALTER TABLE "WordProgress" DROP CONSTRAINT "WordProgress_userId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "level",
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "curent_language",
ADD COLUMN     "current_language" "Language" NOT NULL DEFAULT 'EN',
DROP COLUMN "purposes",
ADD COLUMN     "purposes" "Purpose"[] DEFAULT ARRAY['NONE']::"Purpose"[],
DROP COLUMN "current_level",
ADD COLUMN     "current_level" "Level" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "score" INTEGER;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "level",
ADD COLUMN     "level" "Level";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "partOfSpeech" TEXT;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordProgress" ADD CONSTRAINT "WordProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
