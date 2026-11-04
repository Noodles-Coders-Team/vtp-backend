/*
  Warnings:

  - The primary key for the `steam_app_reference_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `steam_app_reference_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "steam_app_reference_data" DROP CONSTRAINT "steam_app_reference_data_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "steam_app_reference_data_pkey" PRIMARY KEY ("id");
