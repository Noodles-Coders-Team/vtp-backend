/*
  Warnings:

  - Added the required column `is_tags_imported` to the `steam_app` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "steam_app" ADD COLUMN     "is_tags_imported" BOOLEAN NOT NULL DEFAULT false;
