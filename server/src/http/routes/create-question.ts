import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { z } from "zod/v4"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts"
import { and, eq, sql } from "drizzle-orm"

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

      const embeddings = await generateEmbeddings(questions)
      const embeddingsAsString = `[${embeddings.join(',')}]`

      // Chunks de audio comparando proximidade de valores
      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(3)

      // Testando chunks
      // return chunks
      // Vai no httpquery pega pergunta(roomId) feita e manda no createQuestion

      let answer: string | null = null

      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription)

        answer = await generateAnswer(questions, transcriptions)
      }


      // O postgres aceita varios formatos e a inserção pode ser objeto/array etc..
      const results = await db.insert(schema.questions).values({
        roomId, questions, answer
      }).returning()

      const insertedQuestion = results[0]

      if(!insertedQuestion){
        throw new Error('Failed to created room')
      }

      // 1h16
      return reply.status(201).send({ 
        questionId: insertedQuestion.id,
        answer
       })
  })
}