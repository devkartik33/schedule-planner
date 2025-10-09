import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SemesterForm } from "./SemesterForm";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const SemesterModal = ({ isOpen, semester, onClose, onSuccess }) => {
  const isEdit = !!semester;
  const createSemester = useEntityMutation("semester", "create");
  const updateSemester = useEntityMutation("semester", "patch");
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateSemester.mutateAsync({ id: semester.id, data: values });
        toast.success("Semester updated successfully");
      } else {
        await createSemester.mutateAsync(values);
        toast.success("Semester created successfully");
      }

      // Сначала инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["semester"],
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
        error.message || `Failed to ${isEdit ? "update" : "create"} semester`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Semester" : "Create Semester"}
          </DialogTitle>
        </DialogHeader>
        <SemesterForm
          defaultValues={
            isEdit
              ? {
                  name: semester.name,
                  number: semester.number,
                  academic_year_id: semester.academic_year_id,
                  period: semester.period,
                  start_date: semester.start_date,
                  end_date: semester.end_date,
                }
              : {
                  name: "",
                  number: 1,
                  academic_year_id: "",
                  period: "winter",
                  start_date: "",
                  end_date: "",
                }
          }
          isEdit={isEdit}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={createSemester.isPending || updateSemester.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
