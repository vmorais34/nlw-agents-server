import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { z } from "zod/v4"
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schema/index.ts"

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms/:roomId/audio', {
    // Validação para criar a sala
    schema: {
      params: z.object({
        roomId: z.string(),
      }),
    }
  }, 
  async (request, reply) => {
      const { roomId } = request.params
      const audio = await request.file()

      if(!audio) {
        throw new Error('Audio not found and is required')
      }

      // Ele acumula em memória todo conteudo do audio
      const audioBuffer = await audio.toBuffer()
      const audioAsBase64 = audioBuffer.toString('base64')

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      )
      const embeddings = await generateEmbeddings(transcription)

      // Salvando audio no DB
      const result = await db.insert(schema.audioChunks).values({
        roomId,
        transcription,
        embeddings
      }).returning()

      const chunk = result[0]

      if(!chunk){
        throw new Error('Failed to save audio chunk')
      }

      // Para testar no front
      // return { transcription, embeddings }
      // Retorno para salvar BD
      return reply.status(201).send({ chunkId: chunk.id })

      // 1. Transcrever o audio 
      // 2. Gerar o vetor semantico / embeddings
      // 3. Armazenar os vetores no BD
  })
}