/*
  Warnings:

  - You are about to drop the column `is_data_imported` on the `steam_app` table. All the data in the column will be lost.
  - You are about to drop the column `is_tags_imported` on the `steam_app` table. All the data in the column will be lost.
  - You are about to drop the column `metacritic_score` on the `steam_app` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "steam_app" DROP COLUMN "is_data_imported",
DROP COLUMN "is_tags_imported",
DROP COLUMN "metacritic_score",
ADD COLUMN     "last_info_updated" TIMESTAMP(3),
ADD COLUMN     "review_positive_count" INTEGER,
ADD COLUMN     "review_positive_percent" INTEGER;
