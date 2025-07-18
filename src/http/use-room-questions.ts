import { useQuery } from "@tanstack/react-query";
import type { GetRoomsQuestionsResponse } from "./types/get-rooms-questions-response";

export function useRoomQuestions(roomId: string) {
  // This function can be used to fetch rooms data
  return useQuery({
    queryKey: ["get-questions", roomId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/rooms/${roomId}/questions`);
      const result: GetRoomsQuestionsResponse = await response.json();
      return result;
    },
    //staleTime: 5000, // Data is fresh for 5 seconds
  });

}