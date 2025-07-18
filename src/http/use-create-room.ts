import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-room"],
    mutationFn: async (newRoomData: { name: string; description: string }) => {
      const response = await fetch("http://localhost:3333/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoomData),
      });
      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const result: {roomId: string} = await response.json();
      return result;
    },
    onSuccess: (data) => {
      // Invalidate the rooms query to refetch the list of rooms
      queryClient.invalidateQueries({ queryKey: ["get-rooms"] });
      console.log("Room created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating room:", error);
    },
  });
}
