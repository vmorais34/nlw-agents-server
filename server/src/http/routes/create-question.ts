import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { z } from "zod/v4"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms/:roomId/questions', {
    // Validação para criar a sala
    schema: {
      params: z.object({
        roomId: z.string(),
      }),
      body: z.object({
        questions: z.string().min(1),
      })
    }
  }, 
  async (request, reply) => {
      const { roomId } = request.params
      const { questions } = request.body

      // O postgres aceita varios formatos e a inserção pode ser objeto/array etc..
      const results = await db.insert(schema.questions).values({
        roomId, questions
      }).returning()

      const insertedQuestion = results[0]

      if(!insertedQuestion){
        throw new Error('Failed to created room')
      }

      return reply.status(201).send({ questionId: insertedQuestion.id })
  })
}