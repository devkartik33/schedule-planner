import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEntityList } from "@/hooks/useEntityList";

const schema = z.object({
  contract_id: z.coerce.number().min(1),
  study_form_id: z.coerce.number().min(1),
  assigned_hours: z.coerce.number().min(0),
});

const WorkloadForm = ({
  defaultValues = {},
  isEdit = false,
  onSubmit,
  showButtons = true,
  isLoading = false,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      contract_id: defaultValues.contract_id || "",
      study_form_id: defaultValues.study_form_id || "",
      assigned_hours: defaultValues.assigned_hours || "",
    },
  });

  let { data: contracts = [], isLoading: loadingContracts } = useEntityList(
    "professor_contract",
    {
      filters: {
        page: 1,
        pageSize: 100,
      },
    }
  );

  let { data: studyForms = [], isLoading: loadingStudyForms } = useEntityList(
    "study_form",
    {
      filters: {
        sort_by: "direction_name",
        desc: false,
        page: 1,
        pageSize: 100,
      },
    }
  );

  contracts = contracts.items || [];
  studyForms = studyForms.items || [];

  const handleSubmit = (data) => {
    onSubmit({
      contract_id: Number(data.contract_id),
      study_form_id: Number(data.study_form_id),
      assigned_hours: Number(data.assigned_hours),
    });
  };

  return (
    <Form {...form}>
      <form
        id="workload-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`space-y-6 ${showButtons ? "max-w-xl" : ""}`}
      >
        <FormField
          control={form.control}
          name="contract_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  {loadingContracts ? (
                    <div className="p-2 text-sm">Loading...</div>
                  ) : contracts.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No contracts found
                    </div>
                  ) : (
                    contracts.map((contract) => (
                      <SelectItem key={contract.id} value={String(contract.id)}>
                        {contract.professor?.name} {contract.professor?.surname}{" "}
                        - {contract.semester?.name}
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
          name="study_form_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direction</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ""}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select direction and study form" />
                </SelectTrigger>
                <SelectContent>
                  {loadingStudyForms ? (
                    <div className="p-2 text-sm">Loading...</div>
                  ) : studyForms.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No study forms found
                    </div>
                  ) : (
                    studyForms.map((sf) => (
                      <SelectItem key={sf.id} value={String(sf.id)}>
                        {sf.direction?.name} ({sf.form})
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
          name="assigned_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Hours</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showButtons && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default WorkloadForm;
