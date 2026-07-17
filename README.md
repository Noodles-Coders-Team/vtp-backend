# NCT
This is simple Node.js + Express + Prisma front end site. Depends on [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common) and uses [vtp-front](https://github.com/Noodles-Coders-Team/vtp-front) as frontend

# After update
After new commits awailable don't forget to update local instalations:
* `npm install` - if `package.json` was updated
* `npx prisma generate` - if `prisma.schema` was updated

# Node.JS
Install dependencies locally by running `npm install`. After that generate prisma cache using `npx prisma generate`.

To start backend server run: `npm run dev`.

**NOTE:**
In case `@nct/vtp-common is missing` locate [vtp-common](https://github.com/Noodles-Coders-Team/vtp-common) repository and follow `README.md`

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