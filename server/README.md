# NLW AGENTS - Server

This is the server of the project NLW AGENTS, a project created during the event NLW (Next Level Week) by Rocketseat.

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

### How see if extension is running

-  docker exec -it server-nlw-agents-pg-1 psql -U docker -d agents -c "SELECT * FROM pg_extension WHERE extname = 'vector';"