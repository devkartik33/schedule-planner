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
import WorkloadForm from "./WorkloadForm";

export default function WorkloadModal({
  isOpen,
  workload,
  onClose,
  onSuccess,
}) {
  const isEdit = !!workload;
  const createWorkload = useEntityMutation("professor_workload", "create");
  const updateWorkload = useEntityMutation("professor_workload", "patch");
  const queryClient = useQueryClient();

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateWorkload.mutateAsync({ id: workload.id, data: values });
        toast.success("Workload updated successfully");
      } else {
        await createWorkload.mutateAsync(values);
        toast.success("Workload created successfully");
      }

      // Сначала инвалидируем кеш
      queryClient.invalidateQueries({
        queryKey: ["professor_workload"],
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
          ? error.message || "Error updating workload"
          : error.message || "Error creating workload"
      );
    }
  };

  // Преобразуем данные для формы
  const defaultValues = isEdit
    ? {
        contract_id: workload?.contract?.id || "",
        study_form_id: workload?.study_form?.id || "",
        assigned_hours: workload?.assigned_hours || "",
      }
    : {
        contract_id: "",
        study_form_id: "",
        assigned_hours: "",
      };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Workload" : "Create Workload"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-w-2xl">
          <WorkloadForm
            defaultValues={defaultValues}
            isEdit={isEdit}
            onSubmit={handleSubmit}
            showButtons={false}
            isLoading={createWorkload.isPending || updateWorkload.isPending}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createWorkload.isPending || updateWorkload.isPending}
            form="workload-form"
          >
            {createWorkload.isPending || updateWorkload.isPending
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
