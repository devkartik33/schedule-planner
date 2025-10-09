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
import ScheduleForm from "./ScheduleForm";

export default function ScheduleModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const createSchedule = useEntityMutation("schedule", "create");

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await createSchedule.mutateAsync(values);
      toast.success("Schedule created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error creating schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new schedule.
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm
          id="schedule-form"
          defaultValues={{
            name: "",
            academic_year_id: "",
            semester_id: "",
            direction_id: "",
          }}
          isEdit={false}
          onSubmit={handleSubmit}
          showButtons={false}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
