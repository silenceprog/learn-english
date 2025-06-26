/*
  Warnings:

  - The values [EXAM] on the enum `Purpose` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Purpose_new" AS ENUM ('NONE', 'WORK', 'TRAVEL', 'EDUCATION', 'SELF_DEV', 'COMMUNICATION', 'HOBBY');
ALTER TABLE "Setting" ALTER COLUMN "purposes" DROP DEFAULT;
ALTER TABLE "Setting" ALTER COLUMN "purposes" TYPE "Purpose_new"[] USING ("purposes"::text::"Purpose_new"[]);
ALTER TYPE "Purpose" RENAME TO "Purpose_old";
ALTER TYPE "Purpose_new" RENAME TO "Purpose";
DROP TYPE "Purpose_old";
ALTER TABLE "Setting" ALTER COLUMN "purposes" SET DEFAULT ARRAY['NONE']::"Purpose"[];
COMMIT;
