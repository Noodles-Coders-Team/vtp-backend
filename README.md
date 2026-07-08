# NCT
This is simple Node.js + Express + Prisma front end site. Depends on [weather-common](https://github.com/Noodles-Coders-Team/weather-common) and uses [weather-frontend](https://github.com/Noodles-Coders-Team/weather-frontend) as frontend

# After update
After new commits awailable don't forget to update local instalations:
* `npm install`
* `npx prisma generate`

# Node.JS
Install dependencies locally by running `npm install`. After that generate prisma cache using `npx prisma generate`.

To start backend server run: `npm run dev`.

**NOTE:**
In case `@nct/weather-common is missing` locate [weather-common](https://github.com/Noodles-Coders-Team/weather-common) repository and follow `README.md`

# Prisma

To create new migration for DB:
`npx prisma migrate dev --name NAME`

To reset current instance of DB:
`npx prisma migrate reset`

To generate new models used by TypeScript:
`npx prisma generate`

To Open Prisma DB UI:
`npx prisma studio`

# API Docs

The API documentation is available through Swagger UI at:

- http://localhost:8080/docs