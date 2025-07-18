import { useQuery } from "@tanstack/react-query";
import type { GetRoomsResponse } from "./types/get-rooms-response";

export function useRooms() {
  // This function can be used to fetch rooms data
  // and return it along with loading state.
  return useQuery({
    queryKey: ["get-rooms"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3333/rooms");
      const result: GetRoomsResponse = await response.json();
      return result;
    },
    //staleTime: 5000, // Data is fresh for 5 seconds
  });

}