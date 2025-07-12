import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type GetRoomsAPIResponse = Array<{
  id: string;
  name: string;
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-rooms"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3333/rooms");
      const result: GetRoomsAPIResponse = await response.json();
      return result;
    },
    //staleTime: 5000, // Data is fresh for 5 seconds
  })

  return (
    <div>
      <h1>Create a new room</h1>

      {
        isLoading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="flex flex-col gap-1">
            {data?.map(room => (
              <Link
                to={`/room/${room.id}`}
                className="text-blue-500 hover:underline"
                key={room.id}
              >
                {room.name}  Go to Room
              </Link>
            ))}
          </div>
        )
      }
    </div >
  );
}