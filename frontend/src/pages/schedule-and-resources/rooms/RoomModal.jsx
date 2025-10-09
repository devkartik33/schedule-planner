import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import RoomForm from "./RoomForm";

export default function RoomModal({ isOpen, onClose, room = null, onSuccess }) {
  const isEdit = Boolean(room);
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = useEntityMutation("room", "create");
  const updateRoom = useEntityMutation("room", "patch");

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await updateRoom.mutateAsync({ id: room.id, data: values });
        toast.success("Room updated successfully");
      } else {
        await createRoom.mutateAsync(values);
        toast.success("Room created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error.message || `Error ${isEdit ? "updating" : "creating"} room`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Room" : "Create New Room"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the room information below."
              : "Fill in the details to create a new room."}
          </DialogDescription>
        </DialogHeader>
        <RoomForm
          id="room-form"
          defaultValues={room}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          showButtons={false}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
