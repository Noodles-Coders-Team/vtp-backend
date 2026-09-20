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
                "There is currently no authentication layer - every endpoint is public.",
                "",
                "### Error handling",
                "",
                "Route handlers do not catch their own errors (the CSV import endpoints are the",
                "one exception). Express 5 forwards a rejected handler promise to the global error",
                "middleware in `app.ts`, so **almost every failure surfaces as `500`**, including",
                "cases another API would report as `404` or `400`:",
                "",
                "- a DTO that fails its zod `ValidateSchema` check, either on the way in or on the",
                "  way back out of Prisma;",
                "- a lookup by id that finds nothing, because the resulting `null` then fails",
                "  schema validation;",
                "- a Prisma `update`/`delete` against a row that does not exist (`P2025`).",
                "",
                "A `404` is only ever produced by the catch-all in `app.ts` for a path that matches",
                "no route at all. A `400` is only produced by the `validateRequest` middleware,",
                "which is currently wired up on `POST /users/create` alone, and by the CSV import",
                "endpoints when no file is attached."
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
                ServerErrorBody: {
                    type: "object",
                    description: "Body produced by the global error middleware in `app.ts`.",
                    properties: {
                        success: {type: "boolean", example: false},
                        message: {
                            type: "string",
                            description: "`err.message`, or `Internal Server Error` when it is empty",
                            example: "Invalid data: ZodError: ..."
                        }
                    }
                },
                SimpleErrorBody: {
                    type: "object",
                    description: "Single field error body used by the 404 catch-all and the import endpoints.",
                    properties: {
                        error: {type: "string", example: "Not found"}
                    }
                },
                MessageErrorBody: {
                    type: "object",
                    description: "Error body returned by the CSV import endpoints own try/catch.",
                    properties: {
                        message: {type: "string", example: "Import failed!"}
                    }
                },
                ZodValidationError: {
                    type: "object",
                    description: [
                        "A serialised zod `ZodError`. `validateRequest` passes the error straight to",
                        "`res.json`, so the issue list arrives as a JSON string inside `message`",
                        "rather than as a nested array."
                    ].join(" "),
                    properties: {
                        name: {type: "string", example: "ZodError"},
                        message: {
                            type: "string",
                            description: "JSON encoded array of zod issues",
                            example: "[\n  {\n    \"expected\": \"string\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"user_name\"\n    ],\n    \"message\": \"Invalid input: expected string, received undefined\"\n  }\n]"
                        }
                    }
                },
                User: {
                    type: "object",
                    description: "Mirrors `UserSchema` in `@nct/vtp-common`.",
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
                    description: [
                        "The create payload is identical to `User`: `@nct/vtp-common` exports a single",
                        "`UserSchema` and `login` is itself the primary key, so there is nothing for the",
                        "server to generate."
                    ].join(" "),
                    required: ["login", "user_name"],
                    properties: {
                        login: {type: "string", minLength: 2, maxLength: 100},
                        user_name: {type: "string", minLength: 2, maxLength: 100},
                        permission_level: {type: "string", maxLength: 100, nullable: true}
                    }
                },
                Game: {
                    type: "object",
                    required: ["id", "name", "recorded"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        name: {type: "string"},
                        release_date: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            description: [
                                "Returned as an ISO timestamp.",
                                "",
                                "**Known defect:** the DTO types this field as `z.date()`, which accepts a",
                                "`Date` instance but not the ISO string a JSON body carries. Reads are fine,",
                                "because Prisma hands back a real `Date`, but a write that carries a",
                                "non-null `release_date` is rejected and surfaces as a 500. In practice the",
                                "field can only be sent as `null` or left out."
                            ].join("\n")
                        },
                        link: {type: "string", nullable: true},
                        recorded: {type: "boolean"}
                    }
                },
                CreateGame: {
                    type: "object",
                    required: ["name", "recorded"],
                    properties: {
                        name: {type: "string"},
                        release_date: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                            description: "Send `null` or omit it - see the note on `Game.release_date`"
                        },
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
                    description: [
                        "A queue position recorded for a game on a given date.",
                        "",
                        "**Known defect:** `RankSchema` in `@nct/vtp-common` types `date` as a plain",
                        "string, but Prisma hydrates the `rank.date` column into a `Date`. Every read",
                        "path validates the Prisma row against that schema, so the check fails with",
                        "`expected string, received Date` and the request ends as a `500`. This",
                        "affects every operation under the `Ranks` tag as soon as one rank row exists,",
                        "and `POST /games/with-info`, which reads the latest rank per game."
                    ].join("\n"),
                    required: ["id", "game_id", "date", "rank"],
                    properties: {
                        id: {type: "string", format: "uuid"},
                        game_id: {type: "string", format: "uuid"},
                        date: {
                            type: "string",
                            format: "date-time",
                            description: "Declared as a string by the DTO, stored as a timestamp by Prisma"
                        },
                        rank: {type: "number", description: "Stored as a float, 50 is treated as neutral"}
                    }
                },
                CreateRank: {
                    type: "object",
                    required: ["game_id", "date", "rank"],
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                            description: "Accepted but ignored, the row is matched on game_id plus date"
                        },
                        game_id: {type: "string", format: "uuid"},
                        date: {
                            type: "string",
                            format: "date-time",
                            description: "Must be a string, it is handed to Prisma as the timestamp value"
                        },
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
                    required: ["id", "import_date", "post_id", "category", "post_title", "duration"],
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
                            description: [
                                "Intended to hold Post, Shorts or Video, classified from `duration`.",
                                "Nothing derives it today - `POST /import/table-data` writes a literal",
                                "`null` - so it is only ever set by a caller writing it directly.",
                                "The key must be present in a request body, send null rather than",
                                "omitting it."
                            ].join(" ")
                        },
                        post_title: {
                            type: "string",
                            nullable: true,
                            description: "The key must be present, send null rather than omitting it"
                        },
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
                        id: {
                            type: "string",
                            description: [
                                "Date of the measurement, used as the primary key. Stored exactly as the",
                                "imported CSV spelled it - it is never parsed or normalised - so the format",
                                "is whatever the source file used."
                            ].join(" "),
                            example: "2026-09-20"
                        },
                        views: {type: "integer", description: "View counter for that date"}
                    }
                },
                DropDownData: {
                    type: "object",
                    required: ["key", "value", "score", "type"],
                    properties: {
                        key: {
                            type: "string",
                            description: [
                                "Primary key, in the form `<type>_<value>`.",
                                "",
                                "`DropDownSchema` declares this field as a required string and only fills it",
                                "in afterwards, when the supplied value is falsy. Omitting the field is",
                                "therefore rejected, but sending an empty string is not: pass `\"\"` to have",
                                "the server derive the key, or pass the exact `<type>_<value>` yourself."
                            ].join("\n"),
                            example: "tag_horror"
                        },
                        value: {type: "string"},
                        score: {
                            type: "integer",
                            description: [
                                "Weight used when scoring a game. The DTO accepts any number, but the",
                                "column is an integer, so a fractional score is rejected by the database."
                            ].join(" ")
                        },
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
                    description: [
                        "Request body failed schema validation in the `validateRequest` middleware.",
                        "Only `POST /users/create` is wired up with that middleware; on every other",
                        "endpoint a bad body fails inside the service instead and comes back as a 500."
                    ].join(" "),
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ZodValidationError"}
                        }
                    }
                },
                NotFound: {
                    description: [
                        "No route matched the request path. Returned by the catch-all in `app.ts`,",
                        "never by an individual handler - a request for an entity that does not exist",
                        "fails during validation or in Prisma and comes back as a 500."
                    ].join(" "),
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/SimpleErrorBody"}
                        }
                    }
                },
                ServerError: {
                    description: [
                        "Unhandled error, surfaced by the global error middleware. Besides genuine",
                        "faults this also covers a missing row on update/delete (Prisma `P2025`), a",
                        "lookup by id that matched nothing, and any request or response body that",
                        "fails its zod DTO."
                    ].join(" "),
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/ServerErrorBody"}
                        }
                    }
                },
                NoFileUploaded: {
                    description: "No file was attached to the `file` field of the multipart body",
                    content: {
                        "application/json": {
                            schema: {
                                allOf: [{$ref: "#/components/schemas/SimpleErrorBody"}],
                                example: {error: "No File uploaded"}
                            }
                        }
                    }
                },
                ImportFailed: {
                    description: [
                        "The upload could not be parsed or persisted. Caught by the import handler",
                        "itself, so the body differs from the usual 500 shape."
                    ].join(" "),
                    content: {
                        "application/json": {
                            schema: {$ref: "#/components/schemas/MessageErrorBody"}
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
});
