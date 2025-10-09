import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEntityList } from "@/hooks/useEntityList";

const SubjectAssignmentForm = ({
  workload,
  assignment = null,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!assignment;

  // Создаем схему валидации с учетом максимальных часов
  const validationSchema = z.object({
    subject_id: z.coerce.number().min(1, "Subject is required"),
    hours_per_subject: z.coerce.number().min(1, "Hours must be at least 1"),
  });

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      subject_id: assignment?.subject?.id || "",
      hours_per_subject: assignment?.hours_per_subject || "",
    },
  });

  // Build filters for subjects based on workload info
  const subjectFilters = {
    page: 1,
    pageSize: 100,
  };

  // Add semester filter if available
  if (workload?.semester?.id) {
    subjectFilters.semester_ids = [workload.semester.id];
  }

  // Add direction filter based on professor's contract or workload info
  // You might need to adjust this based on your data structure
  if (workload?.direction?.id) {
    subjectFilters.direction_ids = [workload.direction.id];
  }

  const { data: subjects = [], isLoading } = useEntityList("subject", {
    filters: subjectFilters,
  });

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      workload_id: workload.id,
    };

    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
                disabled={isEditing} // Не разрешаем менять предмет при редактировании
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="p-2 text-sm">Loading...</div>
                  ) : subjects.items?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No subjects found
                    </div>
                  ) : (
                    subjects.items?.map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>
                        {subject.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hours_per_subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Enter hours"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Assignment" : "Assign Subject"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubjectAssignmentForm;
