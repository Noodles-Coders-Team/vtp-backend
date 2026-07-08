//https://dbdiagram.io/d

// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table games{
  id guid [primary key]
  name varchar
  release_date date
  link varchar
  discussed bool
  can_record bool
  recorded bool
}

Table rank{
  id guid [primary key]
  game_id guid
  version_id int
  date datetime
  rank float
}

Table post{
  id varchar [primary key]
  game_id guid
  publication_time datetime
}

Table post_information{
  id guid [primary key]
  version_id int
  import_date datetime
  category varchar // Video Shorts or Post, determined on data import
  video_id varchar
  video_title string
  publish_time datetime
  duration int // ==15 - post; < 300 - shorts; > 300 regular video
  engaged_views int
  average_view_duration time
  average_percentage_viewed_percent float
  stayed_to_watch_percent float
  unique_viewers int
  unique_reach int
  average_views_per_viewer float
  new_viewers int
  returning_viewers int
  casual_viewers int
  regular_viewers int
  hypes int
  hype_points int
  subscribers_gained int
  subscribers_lost int
  likes int
  dislikes int
  likes_vs_dislikes_percent float
  shares int
  comments_added int
  total_sales_usd float
  orders int
  approved_commissions_usd float
  pending_commissions_usd float
  removed_commission_usd float
  youtube_premium_views int
  youtube_premium_watch_time_hours float
  playlist_watch_time_hours float
  views_from_playlist int
  views_per_playlist_start float
  hours_streamed float
  reminders_set int
  chat_messages int
  reactions int
  remix_count int
  remix_views int
  community_clip_views int
  watch_time_from_community_clips_hours float
  card_clicks int
  cards_shown int
  clicks_per_card_shown_percent float
}

Table channel_data{
  id Date [primary key]
  views int
}

Table users{
  login varchar [primary key]
  user_name varchar
  permission_level varchar // Edit & View only?
}

ref games_used_in_video:  post.game_id > games.id // Many to one
ref:  post.id < post_information.video_id
ref games_ranking: rank.game_id > games.id 
