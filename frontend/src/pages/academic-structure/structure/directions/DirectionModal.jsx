import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DirectionForm from "./DirectionForm";

export default function DirectionModal({
  isOpen,
  direction,
  onClose,
  onSuccess,
}) {
  const isEdit = !!direction;
  const queryClient = useQueryClient();

  const createDirection = useEntityMutation("direction", "create");
  const updateDirection = useEntityMutation("direction", "patch");

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateDirection.mutateAsync({ id: direction.id, data: values });
        toast.success("Direction updated successfully");
      } else {
        await createDirection.mutateAsync(values);
        toast.success("Direction created successfully");
      }

      // Сначала инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["direction"],
        exact: false,
      });

      // Потом вызываем коллбек
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      toast.error(
        isEdit ? "Error updating direction" : "Error creating direction"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Direction" : "Create Direction"}
          </DialogTitle>
        </DialogHeader>
        <DirectionForm
          defaultValues={
            direction || {
              name: "",
              code: "",
              faculty_id: "",
              has_full_time: true,
              has_part_time: false,
            }
          }
          isEdit={isEdit}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
