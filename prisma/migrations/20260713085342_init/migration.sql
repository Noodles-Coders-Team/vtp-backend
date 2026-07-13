-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3),
    "link" TEXT,
    "discussed" BOOLEAN NOT NULL,
    "can_record" BOOLEAN NOT NULL,
    "recorded" BOOLEAN NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rank" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "game_id" TEXT NOT NULL,
    "version_id" INTEGER NOT NULL,
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
CREATE TABLE "post_information" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::TEXT,
    "version_id" INTEGER NOT NULL,
    "import_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "video_title" TEXT NOT NULL,
    "publish_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "engaged_views" INTEGER NOT NULL,
    "average_view_duration" TEXT NOT NULL,
    "average_percentage_viewed_percent" DOUBLE PRECISION NOT NULL,
    "stayed_to_watch_percent" DOUBLE PRECISION NOT NULL,
    "unique_viewers" INTEGER NOT NULL,
    "unique_reach" INTEGER NOT NULL,
    "average_views_per_viewer" DOUBLE PRECISION NOT NULL,
    "new_viewers" INTEGER NOT NULL,
    "returning_viewers" INTEGER NOT NULL,
    "casual_viewers" INTEGER NOT NULL,
    "regular_viewers" INTEGER NOT NULL,
    "hypes" INTEGER NOT NULL,
    "hype_points" INTEGER NOT NULL,
    "subscribers_gained" INTEGER NOT NULL,
    "subscribers_lost" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,
    "likes_vs_dislikes_percent" DOUBLE PRECISION NOT NULL,
    "shares" INTEGER NOT NULL,
    "comments_added" INTEGER NOT NULL,
    "total_sales_usd" DOUBLE PRECISION NOT NULL,
    "orders" INTEGER NOT NULL,
    "approved_commissions_usd" DOUBLE PRECISION NOT NULL,
    "pending_commissions_usd" DOUBLE PRECISION NOT NULL,
    "removed_commission_usd" DOUBLE PRECISION NOT NULL,
    "youtube_premium_views" INTEGER NOT NULL,
    "youtube_premium_watch_time_hours" DOUBLE PRECISION NOT NULL,
    "playlist_watch_time_hours" DOUBLE PRECISION NOT NULL,
    "views_from_playlist" INTEGER NOT NULL,
    "views_per_playlist_start" DOUBLE PRECISION NOT NULL,
    "hours_streamed" DOUBLE PRECISION NOT NULL,
    "reminders_set" INTEGER NOT NULL,
    "chat_messages" INTEGER NOT NULL,
    "reactions" INTEGER NOT NULL,
    "remix_count" INTEGER NOT NULL,
    "remix_views" INTEGER NOT NULL,
    "community_clip_views" INTEGER NOT NULL,
    "watch_time_from_community_clips_hours" DOUBLE PRECISION NOT NULL,
    "card_clicks" INTEGER NOT NULL,
    "cards_shown" INTEGER NOT NULL,
    "clicks_per_card_shown_percent" DOUBLE PRECISION NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "post_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_data" (
    "id" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL,

    CONSTRAINT "channel_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "login" TEXT NOT NULL,
    "user_name" TEXT,
    "permission_level" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("login")
);
