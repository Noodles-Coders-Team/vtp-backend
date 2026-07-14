-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "link" TEXT,
    "recorded" BOOLEAN NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_info" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "discussed" BOOLEAN NOT NULL,
    "can_record" BOOLEAN NOT NULL,
    "genre" TEXT[],
    "tags" TEXT[],
    "notes" TEXT,

    CONSTRAINT "game_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "publication_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_info" (
    "id" TEXT NOT NULL,
    "import_date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "video_title" TEXT,
    "publishTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "engaged_views" INTEGER,
    "average_view_duration" TIME,
    "average_percentage" DOUBLE PRECISION,
    "stayed_to_watch_percent" DOUBLE PRECISION,
    "unique_viewers" INTEGER,
    "unique_reach" INTEGER,
    "average_views_per_viewer" DOUBLE PRECISION,
    "new_viewers" INTEGER,
    "returning_viewers" INTEGER,
    "casual_viewers" INTEGER,
    "regular_viewers" INTEGER,
    "hypes" INTEGER,
    "hype_points" INTEGER,
    "subscribers_gained" INTEGER,
    "subscribers_lost" INTEGER,
    "likes" INTEGER,
    "dislikes" INTEGER,
    "likes_vs_dislikes_percent" DOUBLE PRECISION,
    "shares" INTEGER,
    "comments_added" INTEGER,
    "total_sales_usd" DOUBLE PRECISION,
    "orders" INTEGER,
    "approved_commissions" DOUBLE PRECISION,
    "pending_commissions" DOUBLE PRECISION,
    "removed_commission" DOUBLE PRECISION,
    "youtube_premium_views" INTEGER,
    "youtube_premium_watch_time_hours" DOUBLE PRECISION,
    "playlist_watch_time_hours" DOUBLE PRECISION,
    "views_from_playlist" INTEGER,
    "views_per_playlist_start" DOUBLE PRECISION,
    "hours_streamed" DOUBLE PRECISION,
    "reminders_set" INTEGER,
    "chat_messages" INTEGER,
    "reactions" INTEGER,
    "remix_count" INTEGER,
    "remix_views" INTEGER,
    "community_clip_views" INTEGER,
    "watch_time_from_community_clips_hours" DOUBLE PRECISION,
    "card_clicks" INTEGER,
    "cards_shown" INTEGER,
    "clicks_per_card_shown_percent" DOUBLE PRECISION,

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
    "user_name" TEXT NOT NULL,
    "permission_level" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("login")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_info_game_id_key" ON "game_info"("game_id");

-- AddForeignKey
ALTER TABLE "game_info" ADD CONSTRAINT "game_info_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rank" ADD CONSTRAINT "rank_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_info" ADD CONSTRAINT "post_info_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
