/*
  Warnings:

  - You are about to drop the column `permission_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `channel_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `drop_down_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `game_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rank` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SteamAppReferenceDataType" AS ENUM ('GENRE', 'CATEGORY', 'TAG');

-- DropForeignKey
ALTER TABLE "game_info" DROP CONSTRAINT "game_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "post_info" DROP CONSTRAINT "post_info_post_id_fkey";

-- DropForeignKey
ALTER TABLE "rank" DROP CONSTRAINT "rank_game_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "permission_level";

-- DropTable
DROP TABLE "channel_data";

-- DropTable
DROP TABLE "drop_down_data";

-- DropTable
DROP TABLE "game";

-- DropTable
DROP TABLE "game_info";

-- DropTable
DROP TABLE "post";

-- DropTable
DROP TABLE "post_info";

-- DropTable
DROP TABLE "rank";

-- CreateTable
CREATE TABLE "user_game_score_config" (
    "id" TEXT NOT NULL,
    "user_login" TEXT NOT NULL,
    "score_config_label" TEXT NOT NULL,
    "score_config" JSONB NOT NULL,

    CONSTRAINT "user_game_score_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steam_app_reference_data" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "SteamAppReferenceDataType" NOT NULL,

    CONSTRAINT "steam_app_reference_data_pkey" PRIMARY KEY ("id")
);
