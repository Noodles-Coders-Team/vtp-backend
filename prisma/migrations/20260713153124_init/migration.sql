-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "recorded" BOOLEAN NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_info" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "discussed" BOOLEAN NOT NULL,
    "canRecord" BOOLEAN NOT NULL,
    "genre" TEXT[],
    "tags" TEXT[],
    "notes" TEXT,

    CONSTRAINT "game_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "versionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "publicationTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_info" (
    "id" TEXT NOT NULL,
    "versionId" INTEGER NOT NULL,
    "importDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT,
    "publishTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "engagedViews" INTEGER,
    "averageViewDuration" TIME,
    "averagePercentage" DOUBLE PRECISION,
    "stayedToWatchPercent" DOUBLE PRECISION,
    "uniqueViewers" INTEGER,
    "uniqueReach" INTEGER,
    "averageViewsPerViewer" DOUBLE PRECISION,
    "newViewers" INTEGER,
    "returningViewers" INTEGER,
    "casualViewers" INTEGER,
    "regularViewers" INTEGER,
    "hypes" INTEGER,
    "hypePoints" INTEGER,
    "subscribersGained" INTEGER,
    "subscribersLost" INTEGER,
    "likes" INTEGER,
    "dislikes" INTEGER,
    "likesVsDislikesPercent" DOUBLE PRECISION,
    "shares" INTEGER,
    "commentsAdded" INTEGER,
    "totalSalesUsd" DOUBLE PRECISION,
    "orders" INTEGER,
    "approvedCommissions" DOUBLE PRECISION,
    "pendingCommissions" DOUBLE PRECISION,
    "removedCommission" DOUBLE PRECISION,
    "youtubePremiumViews" INTEGER,
    "youtubePremiumWatchTimeHours" DOUBLE PRECISION,
    "playlistWatchTimeHours" DOUBLE PRECISION,
    "viewsFromPlaylist" INTEGER,
    "viewsPerPlaylistStart" DOUBLE PRECISION,
    "hoursStreamed" DOUBLE PRECISION,
    "remindersSet" INTEGER,
    "chatMessages" INTEGER,
    "reactions" INTEGER,
    "remixCount" INTEGER,
    "remixViews" INTEGER,
    "communityClipViews" INTEGER,
    "watchTimeFromCommunityClipsHours" DOUBLE PRECISION,
    "cardClicks" INTEGER,
    "cardsShown" INTEGER,
    "clicksPerCardShownPercent" DOUBLE PRECISION,

    CONSTRAINT "post_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_data" (
    "id" TIMESTAMP(3) NOT NULL,
    "views" INTEGER,

    CONSTRAINT "channel_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "login" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "permissionLevel" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("login")
);

-- AddForeignKey
ALTER TABLE "game_info" ADD CONSTRAINT "game_info_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank" ADD CONSTRAINT "rank_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_info" ADD CONSTRAINT "post_info_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
