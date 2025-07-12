import { Navigate, useParams } from "react-router-dom";

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  
  if (!roomId) {
    return <Navigate to="/" replace/>; // Redirect to home if roomId is not found
  }
  return (
    <div>
      <h1>Room Details!</h1>
      <p>Welcome to the room!</p>
      <span>Room ID: {roomId}</span>
    </div>
  );
}