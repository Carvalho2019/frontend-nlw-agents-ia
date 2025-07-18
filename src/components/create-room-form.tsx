import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useCreateRoom } from "@/http/use-create-room";

const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
});

type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

export function CreateRoomForm() {
  // Using react-hook-form to manage form state and validation
  const { mutateAsync: createRoom } = useCreateRoom();


  //Configuration for lib react-hook-form
  const createRoomForm = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function handleCreateRoom(data: CreateRoomFormValues) {
    await createRoom({ name: data.name, description: data.description ?? "" });
    // You can handle the response here, e.g., redirecting to the new room page
    createRoomForm.reset(); // Reset the form after successful creation
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>
          Create a new room to start asking questions and receive to response IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium">Room Name</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      {...field}
                      placeholder="Enter room name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-sm font-medium">Room Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter room description (optional)"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Create Room</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}