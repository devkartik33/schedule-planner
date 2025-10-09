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
import GroupForm from "./GroupForm";

export default function GroupModal({
  isOpen,
  onClose,
  group = null,
  onSuccess,
}) {
  const isEdit = Boolean(group);
  const [isLoading, setIsLoading] = useState(false);

  const createGroup = useEntityMutation("group", "create");
  const updateGroup = useEntityMutation("group", "patch");

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await updateGroup.mutateAsync({ id: group.id, data: values });
        toast.success("Group updated successfully");
      } else {
        await createGroup.mutateAsync(values);
        toast.success("Group created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error.message || `Error ${isEdit ? "updating" : "creating"} group`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Group" : "Create New Group"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the group information below."
              : "Fill in the details to create a new group."}
          </DialogDescription>
        </DialogHeader>
        <GroupForm
          id="group-form"
          defaultValues={group}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          showButtons={false}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
