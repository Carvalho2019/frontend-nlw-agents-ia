import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { formatRelativeDate } from "@/lib/format-relative-date";
import { ArrowRight } from "lucide-react";
import { useRooms } from "@/http/use-rooms";

export function RoomList() {
  
  const { data, isLoading } = useRooms();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recents Room </CardTitle>
        <CardDescription>
          Acess quickly to your recent rooms
        </CardDescription>
      </CardHeader>
      < CardContent className="flex flex-col gap-3" >
        {
          isLoading ? (
            <p> Loading...</p>
          ) : (
            data?.map((room) => (
              <Link
                key={room.id}
                to={`/room/${room.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
              >
                <div className="flex-1 flex flex-col gap-1" >
                  <h3 className="font-medium" >
                    {room.name}
                  </h3>
                  < div className="flex items-center gap-2 text-small text-muted-foreground" >
                    <Badge variant={"secondary"} className="text-xs" >
                      {room.questionCount} questions
                    </Badge>
                    < Badge variant={"secondary"} className="text-xs" >
                      {/*new Date(room.createdAt).toLocaleDateString()*/}
                      {formatRelativeDate(new Date(room.createdAt))}
                    </Badge>
                  </div>
                </div>
                < span className="flex items-center gap-1 text-sm" >
                  Enter
                  < ArrowRight className="size-3" />
                </span>
              </Link>
            ))
          )}
      </CardContent>
    </Card>
  )
}

