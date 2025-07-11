import { CreateRoomForm } from "@/components/create-room-form"
import { RoomList } from "@/components/room-list"

export function CreateRoom() {

  return (
    <>
      {/* { isLoading && <p>Loading...</p>} */}

      <div className="min-h-screen px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 items-start gap-8">
              <CreateRoomForm />
              <RoomList />
            </div>
          </div>
        </div>

      {/* Sem usar a tag a, que faria o reload de toda pagina novamente. */}
      {/* <Link to={'/room'}>Room</Link> */}
    </>
  )
}