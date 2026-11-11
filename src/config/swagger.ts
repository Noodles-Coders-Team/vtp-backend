import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VTP API",
            version: "1.0.0",
            description: [
                "REST API for Video Tracking and Planning, consumed by the `vtp-front` client.",
                "",
                "This is an endpoint index: one line per operation, grouped by router. Request",
                "and response shapes are deliberately not described here - they are declared as",
                "zod schemas in `@nct/vtp-common` and that package is the contract both sides",
                "share. Read the schema, not this page, to learn what a payload looks like.",
                "",
                "Every operation below needs a session cookie. Sign-up, sign-in and sign-out are",
                "handled by better-auth under `/api/auth/` and are not listed here. `/settings`",
                "additionally requires the `admin` role."
            ].join("\n")
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local development server"
            }
        ],
        // Swagger UI groups operations by tag and shows the groups in this order, so this
        // list is the table of contents. A new router needs an entry here and a file in
        // src/docs/ whose operations carry the matching tag.
        tags: [
            {
                name: "Steam Apps",
                description: "The mirrored Steam catalogue, the scored listings built from it, and the switches for the three ingestion jobs that fill it."
            },
            {
                name: "Reference Data",
                description: "The dictionary of every distinct genre, category and tag found in the catalogue. It is what the scoring screens list and attach weights to."
            },
            {
                name: "Score Config",
                description: "Named sets of genre, category and tag weights saved per user and reused to rank the catalogue."
            },
            {
                name: "Settings",
                description: "Key/value application settings. Admin only. Settings seeded at startup are flagged as system settings."
            }
        ]
    },
    // One YAML file per router, holding that router's paths and nothing else. The glob is
    // relative to the working directory, so start the server from the repo root.
    apis: ["./src/docs/*.yaml"]
});
