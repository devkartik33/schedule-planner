import { useParams, useNavigate } from "react-router-dom";
import { useEntityQuery } from "@/hooks/useEntityQuery";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ScheduleForm from "./ScheduleForm";
import { LessonsList } from "./lessons";

export default function EditSchedulePage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const {
    data: schedule,
    isLoading,
    isError,
    refetch,
  } = useEntityQuery("schedule", scheduleId);
  const updateSchedule = useEntityMutation("schedule", "patch");

  const handleSubmit = (values) => {
    // При редактировании отправляем только имя, semester_id не меняется
    const updateData = {
      name: values.name,
    };

    updateSchedule.mutate(
      { id: scheduleId, data: updateData },
      {
        onSuccess: () => {
          toast.success("Schedule updated");
          navigate("/schedules");
        },
        onError: (err) => {
          toast.error(err.message || "Error updating schedule");
        },
      }
    );
  };

  if (isLoading) return <div className="p-4">Loading schedule...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading schedule</div>;

  return (
    <div className="container mx-auto py-3 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Edit Schedule</h1>

      {/* Main schedule form */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            isEdit
            defaultValues={schedule}
            onSubmit={handleSubmit}
            isLoading={updateSchedule.isPending}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Lessons section */}
      <LessonsList schedule={schedule} onUpdate={refetch} />
    </div>
  );
}
