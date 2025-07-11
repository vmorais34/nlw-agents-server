import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

type GetRoomsAPIResponse = Array<{
  id: string
  name: string
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsAPIResponse = await response.json()

      return result
    },
  })


  return (
    <>
      { isLoading && <p>Loading...</p>}

      <div>
        { data?.map((room) => {
          return (
            <Link key={room.id} to={`/room/${room.id}`}>{room.name}</Link>
          )
        })}
      </div>

      {/* Sem usar a tag a, que faria o reload de toda pagina novamente. */}
      {/* <Link to={'/room'}>Room</Link> */}
    </>
  )
}