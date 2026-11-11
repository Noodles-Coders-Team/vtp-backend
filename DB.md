//https://dbdiagram.io/d

// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs
// Generated from prisma/schema.prisma - keep both in sync.

enum steam_app_reference_data_type {
  GENRE
  CATEGORY
  TAG
}

Table steam_app {
  id int [primary key]
  is_data_imported bool [not null, default: false]
  is_tags_imported bool [not null, default: false]
  name varchar
  categories varchar[] [not null]
  genres varchar[] [not null]
  tags varchar[] [not null]
  metacritic_score int
  release_date timestamp
  review_count int
}

Table steam_app_reference_data {
  id varchar [primary key]
  value varchar [not null]
  type steam_app_reference_data_type [not null]
}

Table settings {
  key varchar [primary key]
  value varchar [not null]
  display varchar [not null]
  is_system bool [not null]
}

Table user_game_score_config {
  id varchar [primary key]
  user_id varchar [not null]
  score_config_label varchar [not null]
  score_config json [not null]
}

Table user {
  id varchar [primary key]
  name varchar [not null]
  email varchar [not null, unique]
  emailVerified bool [not null, default: false]
  image varchar
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null]

  role varchar
  banned bool [default: false]
  banReason varchar
  banExpires timestamp
}

Table session {
  id varchar [primary key]
  expiresAt timestamp [not null]
  token varchar [not null, unique]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null]
  ipAddress varchar
  userAgent varchar
  userId varchar [not null]

  impersonatedBy varchar

  indexes {
    userId
  }
}

Table account {
  id varchar [primary key]
  accountId varchar [not null]
  providerId varchar [not null]
  userId varchar [not null]
  accessToken varchar
  refreshToken varchar
  idToken varchar
  accessTokenExpiresAt timestamp
  refreshTokenExpiresAt timestamp
  scope varchar
  password varchar
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null]

  indexes {
    userId
  }
}

Table verification {
  id varchar [primary key]
  identifier varchar [not null]
  value varchar [not null]
  expiresAt timestamp [not null]
  createdAt timestamp [not null, default: `now()`]
  updatedAt timestamp [not null]

  indexes {
    identifier
  }
}

//References
ref user_sessions: session.userId > user.id [delete: cascade]
ref user_accounts: account.userId > user.id [delete: cascade]
