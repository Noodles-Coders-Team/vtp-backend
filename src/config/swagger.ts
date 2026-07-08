import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Weather API",
            version: "1.0.0",
            description: "REST API for weather monitoring"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
});