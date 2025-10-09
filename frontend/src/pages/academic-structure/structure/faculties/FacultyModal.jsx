import React from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEntityMutation } from "@/hooks/useEntityMutation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FacultyForm from "./FacultyForm";

export default function FacultyModal({ isOpen, faculty, onClose, onSuccess }) {
  const isEdit = !!faculty;
  const createFaculty = useEntityMutation("faculty", "create");
  const updateFaculty = useEntityMutation("faculty", "patch");
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateFaculty.mutateAsync({ id: faculty.id, data: values });
        toast.success("Faculty updated successfully");
      } else {
        await createFaculty.mutateAsync(values);
        toast.success("Faculty created successfully");
      }

      // Сначала инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["faculty"],
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
        isEdit ? "Failed to update faculty" : "Failed to create faculty"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Faculty" : "Create Faculty"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <FacultyForm
            defaultValues={faculty}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            showButtons={false}
            isLoading={createFaculty.isPending || updateFaculty.isPending}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="faculty-form"
            disabled={createFaculty.isPending || updateFaculty.isPending}
          >
            {createFaculty.isPending || updateFaculty.isPending
              ? "Saving..."
              : isEdit
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
