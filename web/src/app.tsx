// import { Button } from "./components/ui/button";
// import { Wand  } from "lucide-react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecordRoomAudio } from "./pages/record-room-audio";

const queryClient = new QueryClient()

export function App() {

  return (
    <>
      {/* Annnnd DONE

      <Button variant={'link'}>Button</Button>
      <Button variant={'default'} size={'icon'}>
        <Wand />
      </Button> */}

      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
            <Route element={<CreateRoom />} index />
            <Route element={<Room />} path="/room/:roomId" />
            <Route element={<RecordRoomAudio />} path="/room/:roomId/audio" />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
}
