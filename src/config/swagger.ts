import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VTP API",
            version: "1.0.0",
            description: [
                "REST API for Video Tracking and Planning.",
                "",
                "The API is consumed by the `vtp-front` client and shares its request/response",
                "contracts with the `@nct/vtp-common` package, where every DTO is declared as a",
                "zod schema. The schemas below mirror those DTOs.",
                "",
                "There is currently no authentication layer - every endpoint is public."
            ].join("\n")
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local development server"
            }
        ],
        tags: [
            {name: "Users", description: "User management endpoints"},
            {name: "Games", description: "Game management endpoints"},
            {name: "Posts", description: "Post management endpoints"},
            {name: "PostInformation", description: "Per-post statistic snapshots"},
            {name: "Ranks", description: "Game rank history endpoints"},
            {name: "ChannelData", description: "Aggregated channel view counters"},
            {name: "DropDownData", description: "Drop down dictionary values (tags, genres, ...)"},
            {name: "Settings", description: "Key/value application settings"},
            {name: "Import", description: "CSV import endpoints"}
        ],
        components: {
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        error: {type: "string"},
                        message: {type: "string"}
                    }
                },
                User: {
                    type: "object",
                    required: ["login", "user_name"],
                    properties: {
                        login: {type: "string", minLength: 2, maxLength: 100},
                        user_name: {type: "string", minLength: 2, maxLength: 100},
                        permission_level: {
                            type: "string",
                            maxLength: 100,
                            nullable: true,
                            description: "Free form permission label, e.g. edit or view only"
                        }
                    }
                },
                CreateUser: {
                    type: "object",
                    required: ["login", "user_name"],
                    properties: {
                        login: {type: "string", minLength: 2, maxLength: 100},
                        user_name: {type: "string", minLength: 2, maxLength: 100},
                        permission_level: {type: "string", maxLength: 100}
                    }
                },
                Game: {
                    type: "object",
                    required: ["id", "name", "recorded"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        name: {type: "string"},
                        release_date: {type: "string", format: "date-time", nullable: true},
                        link: {type: "string", nullable: true},
                        recorded: {type: "boolean"}
                    }
                },
                CreateGame: {
                    type: "object",
                    required: ["name", "recorded"],
                    properties: {
                        name: {type: "string"},
                        release_date: {type: "string", format: "date-time", nullable: true},
                        link: {type: "string", nullable: true},
                        recorded: {type: "boolean"}
                    }
                },
                GameInformation: {
                    type: "object",
                    required: ["id", "game_id"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        game_id: {type: "string", format: "uuid"},
                        discussed: {type: "boolean", default: false},
                        can_record: {type: "boolean", default: false},
                        genre: {type: "array", items: {type: "string"}},
                        tags: {type: "array", items: {type: "string"}},
                        notes: {type: "string", nullable: true}
                    }
                },
                GameWithInfo: {
                    type: "object",
                    description: "A game joined with its game_info row plus a computed score",
                    properties: {
                        id: {type: "string", format: "uuid"},
                        name: {type: "string"},
                        release_date: {type: "string", format: "date-time", nullable: true},
                        link: {type: "string", nullable: true},
                        recorded: {type: "boolean"},
                        game_id: {type: "string", format: "uuid"},
                        discussed: {type: "boolean"},
                        can_record: {type: "boolean"},
                        genre: {type: "array", items: {type: "string"}},
                        tags: {type: "array", items: {type: "string"}},
                        notes: {type: "string", nullable: true},
                        game_score: {
                            type: "number",
                            nullable: true,
                            description: "Score derived from the genre/tag scores in drop_down_data"
                        }
                    }
                },
                Rank: {
                    type: "object",
                    required: ["id", "game_id", "date", "rank"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        game_id: {type: "string", format: "uuid"},
                        date: {type: "string", format: "date-time"},
                        rank: {type: "number"}
                    }
                },
                CreateRank: {
                    type: "object",
                    required: ["game_id", "date", "rank"],
                    properties: {
                        id: {type: "string", format: "uuid", nullable: true},
                        game_id: {type: "string", format: "uuid"},
                        date: {type: "string", description: "Date string, parsed server side"},
                        rank: {type: "number"}
                    }
                },
                Post: {
                    type: "object",
                    required: ["id"],
                    properties: {
                        id: {
                            type: "string",
                            description: "External post identifier, e.g. the YouTube video id"
                        },
                        game_id: {type: "string", format: "uuid", nullable: true}
                    }
                },
                PostInformation: {
                    type: "object",
                    description: [
                        "A versioned statistics snapshot for a single post. Every numeric field is",
                        "optional because the source CSV export only carries the metrics that apply",
                        "to that post type (video, short, live stream, ...)."
                    ].join(" "),
                    required: ["id", "post_id", "duration", "version_id"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        post_id: {type: "string"},
                        version_id: {
                            type: "integer",
                            default: 1,
                            description: "Incremented every time the same post is imported again"
                        },
                        import_date: {type: "string", format: "date-time"},
                        category: {
                            type: "string",
                            nullable: true,
                            description: "Post, Shorts or Video - derived from duration on import"
                        },
                        post_title: {type: "string", nullable: true},
                        publish_time: {type: "string", nullable: true},
                        duration: {
                            type: "integer",
                            description: "Seconds. == 15 post, < 300 short, > 300 regular video"
                        },
                        engaged_views: {type: "integer", nullable: true},
                        average_view_duration: {type: "string", nullable: true},
                        average_viewed_percent: {type: "number", nullable: true},
                        stayed_to_watch_percent: {type: "number", nullable: true},
                        unique_viewers: {type: "integer", nullable: true},
                        unique_reach: {type: "integer", nullable: true},
                        average_views_per_viewer: {type: "number", nullable: true},
                        new_viewers: {type: "integer", nullable: true},
                        returning_viewers: {type: "integer", nullable: true},
                        casual_viewers: {type: "integer", nullable: true},
                        regular_viewers: {type: "integer", nullable: true},
                        hypes: {type: "integer", nullable: true},
                        hype_points: {type: "integer", nullable: true},
                        subscribers_gained: {type: "integer", nullable: true},
                        subscribers_lost: {type: "integer", nullable: true},
                        likes: {type: "integer", nullable: true},
                        dislikes: {type: "integer", nullable: true},
                        likes_vs_dislikes_percent: {type: "number", nullable: true},
                        shares: {type: "integer", nullable: true},
                        comments_added: {type: "integer", nullable: true},
                        total_sales_usd: {type: "number", nullable: true},
                        orders: {type: "integer", nullable: true},
                        approved_commissions_usd: {type: "number", nullable: true},
                        pending_commissions_usd: {type: "number", nullable: true},
                        removed_commission_usd: {type: "number", nullable: true},
                        youtube_premium_views: {type: "integer", nullable: true},
                        youtube_premium_watch_time_hours: {type: "number", nullable: true},
                        playlist_watch_time_hours: {type: "number", nullable: true},
                        views_from_playlist: {type: "integer", nullable: true},
                        views_per_playlist_start: {type: "number", nullable: true},
                        hours_streamed: {type: "number", nullable: true},
                        reminders_set: {type: "integer", nullable: true},
                        chat_messages: {type: "integer", nullable: true},
                        reactions: {type: "integer", nullable: true},
                        remix_count: {type: "integer", nullable: true},
                        remix_views: {type: "integer", nullable: true},
                        community_clip_views: {type: "integer", nullable: true},
                        watch_time_from_community_clips_hours: {type: "number", nullable: true},
                        card_clicks: {type: "integer", nullable: true},
                        cards_shown: {type: "integer", nullable: true},
                        clicks_per_card_shown_percent: {type: "number", nullable: true}
                    }
                },
                ChannelData: {
                    type: "object",
                    required: ["id", "views"],
                    properties: {
                        id: {type: "string", description: "Date of the measurement, used as the key"},
                        views: {type: "integer"}
                    }
                },
                DropDownData: {
                    type: "object",
                    required: ["value", "score", "type"],
                    properties: {
                        key: {
                            type: "string",
                            nullable: true,
                            description: "Generated server side as `<type>_<value>`; ignored on write"
                        },
                        value: {type: "string"},
                        score: {type: "integer", description: "Weight used when scoring a game"},
                        type: {type: "string", example: "tag"}
                    }
                },
                Setting: {
                    type: "object",
                    required: ["key", "value", "display"],
                    properties: {
                        key: {type: "string", minLength: 2},
                        value: {type: "string", minLength: 1},
                        display: {type: "string", minLength: 2, description: "Label shown in the UI"}
                    }
                },
                ImportResult: {
                    type: "object",
                    properties: {
                        rows: {type: "integer", description: "Number of CSV rows that were parsed"},
                        data: {
                            type: "array",
                            description: "The parsed rows, echoed back as they were read",
                            items: {type: "object"}
                        }
                    }
                }
            },
            responses: {
                ValidationError: {
                    description: "Request body failed schema validation",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/Error"}
                        }
                    }
                },
                NotFound: {
                    description: "The requested entity does not exist",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/Error"}
                        }
                    }
                },
                ServerError: {
                    description: "Unexpected server error",
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/Error"}
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
});
