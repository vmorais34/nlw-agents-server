import { fastifyCors } from "@fastify/cors"
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from "fastify-type-provider-zod";

import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: "http://localhost:5173"
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// Rota para ver se o server ta rodando - healthChecking
app.get('/health', () => {
  return 'OOK!'
})

app.register(getRoomsRoute)


// Maneira antiga e manual
// app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3333 }).then(() => {
// Maneira descolada com validação no arquivo env.ts
app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server is running!')
})