import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateRoomRequest } from './types/create-room-request'
import type { CreateRoomResponse } from './types/create-room-response'


/**
 * Hook para criar uma nova sala.
 *
 * Retorna um hook do react-query do tipo `useMutation` que executa a
 * cria o de uma sala quando chamado.
 *
 * @returns Um hook do tipo `useMutation` com a fun o de muta o que cria
 * uma sala e a fun o de sucesso que invalida o cache da lista de salas
 * quando o processo  bem sucedido.
 */
export function useCreateRoom() {
  const queryClient = useQueryClient()
  // Sempre que for criação, edição ou remoção
  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await fetch('http://localhost:3333/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: CreateRoomResponse = await response.json()

      return result
    },

    // // Dispara a função quando a criação da sala da sucesso
    // // Atualiza a lista de queries que estão em tela 
    /**
     * Called when a room is successfully created.
     * Invalidates the 'get-rooms' query to ensure the room list is refreshed
     * with the newly created room data.
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-rooms'] })
    },
  })
}