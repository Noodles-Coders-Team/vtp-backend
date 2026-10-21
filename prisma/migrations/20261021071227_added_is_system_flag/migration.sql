/*
  Warnings:

  - Added the required column `is_system` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "is_system" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "steam_app" ALTER COLUMN "is_data_imported" SET DEFAULT false;
