import { useQuery } from '@tanstack/react-query'
import type { GetRoomsResponse } from './types/get-rooms-response'

/**
 * Hook que faz uma requisi o GET na rota /rooms,
 * que lista todas as salas existentes no banco de dados.
 *
 * @returns Um objeto com a lista de salas, que s o
 *          atualizadas se a chave da query mudar.
 */
export function useRooms() {
  // query sempre que for listagem
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsResponse = await response.json()

      return result
    },
  })
}