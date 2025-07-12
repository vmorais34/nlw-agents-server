import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const isRecordingSupported = !!navigator.mediaDevices
 && typeof navigator.mediaDevices.getUserMedia === "function" 
 && typeof window.MediaRecorder === "function"


type RoomParams = {
  roomId: string
}
export function RecordRoomAudio(){
  const params = useParams<RoomParams>()  
  const [isRecording, setIsRecording] = useState(false)
  // Usamos o ref quando quero manter a referencia a uma variavel
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>(null)

  async function uploadAudio(audio: Blob){
    const formData = new FormData()

    formData.append('file', audio, 'audio.webm')

    // Rota que vai transcrever nosso audio usando o gemini
    const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
      method: 'POST',
      body: formData,      
    })

    const result = await response.json()
    console.log("result", result)
  }
  function stopRecording() {
    setIsRecording(false)

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }

    // JSON NÃO SUPORTA ENVIAR ARQUIVOS PARA O BACK-END
    // VAMOS SEMPRE USAR O FORMDATA


    // Limpando o interval pra ele não acabar fazendo novamente caso e el clique manualmente
    if(intervalRef.current){
      clearInterval(intervalRef.current)
    }
  }

  function createRecorder(audio: MediaStream) {
    // Aqui é onde cria o MP3
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = event => {
      if (event.data.size > 0) {
        // console.log("event.data", event.data);
        uploadAudio(event.data)
      }
    }

    recorder.current.onstart = () => {
      console.log("recorder Started");
    }
    recorder.current.onstop = () => {
      console.log("recorder Stoped");
    }

    recorder.current.start()
  }

  async function startRecording() {
    if(!isRecordingSupported){
      alert('Navegador nao suporta gravação de áudio')
      return
    }

    setIsRecording(true)
    
    // Pegando o audio do usuario já no navegador
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100
      }
    })

    createRecorder(audio)

    intervalRef.current = setInterval(() => {
      recorder.current?.stop()

      createRecorder(audio)
    }, 5000)
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Pausar gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar áudio</Button>
      )}
      {isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
    </div>
  )
}