/*
  Warnings:

  - The primary key for the `steam_app_reference_data` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `steam_app_reference_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "steam_app_reference_data" DROP CONSTRAINT "steam_app_reference_data_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "steam_app_reference_data_pkey" PRIMARY KEY ("value");
