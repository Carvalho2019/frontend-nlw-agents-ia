import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";

type RoomParams = {
  roomId: string
}

const isRecordingSupported = () => {
  return !!(
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof MediaRecorder === "function");
}

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState(false); // State to manage recording status
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null)

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  function createRecorded(audioStream: MediaStream) {
    const mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 128000,
    });

    mediaRecorderRef.current = mediaRecorder;
    audioStreamRef.current = audioStream;

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const audioBlob = new Blob([event.data], { type: "audio/webm" });
        // Handle the audio blob, e.g., upload it to the server
        console.log("Audio recorded:", audioBlob);
        uploadAudio(audioBlob); // Call the upload function
      }
    }

    mediaRecorder.onstart = () => {
      console.log("MediaRecorder started");
    }
  }

  async function toggleRecording() {
    if (!isRecordingSupported()) {
      alert("Recording is not supported in this browser.");
      return;
    }
    setIsRecording((prev) => !prev); // Toggle recording state
    if (!isRecording) {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      createRecorded(audioStream)
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        //setIsRecording(false);
        mediaRecorderRef.current?.stop();
        createRecorded(audioStream)
        console.log("5 seconds - canceled");      
      }, 5000)

    } else {
      // Stop recording logic here
      try {
        const mediaRecorder = mediaRecorderRef.current;
        const audioStream = audioStreamRef.current;
        if (mediaRecorder && audioStream) {
          mediaRecorder.onstop = () => {
            console.log("Recording stopped");
            audioStream.getTracks().forEach(track => track.stop()); // Stop all audio tracks
          };
          mediaRecorder.stop();
        }
        setIsRecording(false);

        //Quando fizer um stop manual
        if(intervalRef.current){
          clearInterval(intervalRef.current)
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        alert("Failed to stop recording. Please try again.");

      }
    }

  }

  async function uploadAudio(blob: Blob) {
    // Function to upload the audio blob to the server
    const formData = new FormData();
    formData.append("audio", blob, "recorded-audio.webm");

    try {
      const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload audio");
        alert("Failed to upload audio. Please try again.");
        return;
      }
      const result = await response.json();
      console.log("Audio uploaded successfully:", result);
    } catch (error) {

      console.error("Error uploading audio:", error);
      alert("An error occurred while uploading the audio. Please try again.");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Record Room Audio</h1>
        {/* Add your recording functionality here */}
        <Button onClick={toggleRecording} className="mb-4">
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
}