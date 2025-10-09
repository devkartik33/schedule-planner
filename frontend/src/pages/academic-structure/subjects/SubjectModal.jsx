import React from "react";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubjectForm from "./SubjectForm";

export default function SubjectModal({ isOpen, subject, onClose, onSuccess }) {
  const isEdit = !!subject;
  const createSubject = useEntityMutation("subject", "create");
  const updateSubject = useEntityMutation("subject", "patch");
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateSubject.mutateAsync({ id: subject.id, data: values });
        toast.success("Subject updated successfully");
      } else {
        await createSubject.mutateAsync(values);
        toast.success("Subject created successfully");
      }

      // Сначала инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["subject"],
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
        isEdit
          ? error.message || "Error updating subject"
          : error.message || "Error creating subject"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Subject" : "Create Subject"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-w-2xl">
          <SubjectForm
            defaultValues={subject}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            showButtons={false}
            isLoading={createSubject.isPending || updateSubject.isPending}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createSubject.isPending || updateSubject.isPending}
            form="subject-form"
          >
            {createSubject.isPending || updateSubject.isPending
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
