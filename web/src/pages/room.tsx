import { Navigate, useParams } from "react-router-dom"

type RoomParams = {
  roomId: string
}

export function Room() {
  // Acessando o ID da sala
  const params = useParams<RoomParams>()

  // params.roomId


  if(!params.roomId) {
    // replace é opcional - não deixa o usuario voltar para essa pawgina vazia
    return <Navigate replace to={'/'} />
  }

  return (


    <>
      Room Details
    </>
  )
}