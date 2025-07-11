# NLW AGENTS - Server

This is the server of the project NLW AGENTS, a project created during the event NLW (Next Level Week) by Rocketseat.

## Node version: 22.16.0

## Technical Information

* The project uses Fastify as the web framework.
* The database is PostgreSQL.11
* The project uses Drizzle to interact with the database.
* The project uses Zod to validate the data.

## Setup

* To start the server, run the command `npm run start`.
* To run the migrations, run the command `npm run db:seed`.

## Configs

* The database configuration is in the file `server/env.ts`.
* The drizzle configuration is in the file `server/drizzle.config.ts`.

## Used Libraries

* Fastify: a web framework for Node.js.
* Drizzle: a tool to interact with the database.
* Zod: a library to validate the data.
* PostgreSQL: a relational database management system.
