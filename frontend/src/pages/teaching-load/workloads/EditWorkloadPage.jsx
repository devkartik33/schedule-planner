import { useParams, useNavigate } from "react-router-dom";
import { useEntityQuery } from "@/hooks/useEntityQuery";
import { useEntityMutation } from "@/hooks/useEntityMutation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WorkloadForm from "./WorkloadForm";
import { SubjectAssignmentsList } from "./subject-assignments";

export default function EditWorkloadPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: workload,
    isLoading,
    isError,
    refetch,
  } = useEntityQuery("professor_workload", id);
  const updateWorkload = useEntityMutation("professor_workload", "patch");

  const handleSubmit = (values) => {
    updateWorkload.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          toast.success("Workload updated");
          navigate("/workloads");
        },
        onError: (err) => {
          toast.error(err.message || "Error updating workload");
        },
      }
    );
  };

  if (isLoading) return <div className="p-4">Loading workload...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading workload</div>;

  return (
    <div className="container mx-auto py-3 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Edit Workload</h1>

      {/* Main workload form */}
      <Card>
        <CardHeader>
          <CardTitle>Workload Information</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkloadForm
            isEdit
            defaultValues={{
              professor_profile_id: workload.professor?.id || "",
              semester_id: workload.semester?.id || "",
              study_form_id: workload.study_form?.id || "",
              contract_id: workload.contract?.id || "",
              assigned_hours: workload.assigned_hours || "",
            }}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Subject assignments section */}
      <Card>
        <CardContent className="pt-6">
          <SubjectAssignmentsList workload={workload} onUpdate={refetch} />
        </CardContent>
      </Card>
    </div>
  );
}
