-- CreateTable
CREATE TABLE "steam_app" (
    "id" INTEGER NOT NULL,
    "is_data_imported" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "categories" TEXT[],
    "genres" TEXT[],

    CONSTRAINT "steam_app_pkey" PRIMARY KEY ("id")
);
