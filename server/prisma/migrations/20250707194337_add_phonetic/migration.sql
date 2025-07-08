-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "authorId" INTEGER;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "authorId" INTEGER,
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleteAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "audio" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "audioUS" TEXT,
ADD COLUMN     "phonetic" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "phoneticUS" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
