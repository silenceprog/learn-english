-- DropForeignKey
ALTER TABLE "WordTaskProgress" DROP CONSTRAINT "WordTaskProgress_wordId_fkey";

-- AddForeignKey
ALTER TABLE "WordTaskProgress" ADD CONSTRAINT "WordTaskProgress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
