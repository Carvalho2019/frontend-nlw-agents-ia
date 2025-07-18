import { CreateRoomForm } from "@/components/create-room-form";
import { RoomList } from "@/components/room-list";

export function CreateRoom() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-8 grid-cols-2 items-start">
          <CreateRoomForm />
          <RoomList />
        </div>
      </div>
    </div>
  );
}