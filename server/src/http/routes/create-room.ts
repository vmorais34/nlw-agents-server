import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { z } from "zod/v4"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms', {
    // Validação para criar a sala
    schema: {
      body: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    }
  }, 
  async (request, reply) => {
      const { name, description } = request.body

      // O postgres aceita varios formatos e a inserção pode ser objeto/array etc..
      const results = await db.insert(schema.rooms).values({
        name,
        description
      }).returning()

      const insertedRoom = results[0]

      if(!insertedRoom){
        throw new Error('Failed to created room')
      }

      return reply.status(201).send({ roomId: insertedRoom.id })
  })
}