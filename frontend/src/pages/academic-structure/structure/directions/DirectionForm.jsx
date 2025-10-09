import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEntityList } from "@/hooks/useEntityList";

const createSchema = (isEdit) => {
  if (isEdit) {
    return z.object({
      name: z.string().min(1, "Direction name is required"),
      code: z.string().min(1, "Code is required"),
      faculty_id: z.string().optional(),
      has_full_time: z.boolean().optional(),
      has_part_time: z.boolean().optional(),
    });
  }

  return z
    .object({
      name: z.string().min(1, "Direction name is required"),
      code: z.string().min(1, "Code is required"),
      faculty_id: z.string().min(1, "Faculty is required"),
      has_full_time: z.boolean().default(true),
      has_part_time: z.boolean().default(false),
    })
    .refine((data) => data.has_full_time || data.has_part_time, {
      message: "At least one study form must be selected",
      path: ["has_full_time"],
    });
};

export default function DirectionForm({
  defaultValues,
  isEdit = false,
  onSubmit,
}) {
  // Преобразуем данные из API формата в формат формы
  const transformedDefaultValues = {
    name: defaultValues?.name || "",
    code: defaultValues?.code || "",
    faculty_id: String(defaultValues?.faculty?.id ?? ""),
    has_full_time:
      defaultValues?.forms?.some((form) => form.form === "full-time") ?? true,
    has_part_time:
      defaultValues?.forms?.some((form) => form.form === "part-time") ?? false,
  };

  const form = useForm({
    resolver: zodResolver(createSchema(isEdit)),
    defaultValues: transformedDefaultValues,
  });

  const { data, isLoading } = useEntityList("faculty");
  const faculties = data?.items || [];

  // Преобразуем данные формы обратно в формат API
  const handleSubmit = (formData) => {
    const apiData = {
      name: formData.name,
      code: formData.code,
      faculty_id: parseInt(formData.faculty_id),
      has_full_time: formData.has_full_time,
      has_part_time: formData.has_part_time,
    };

    console.log("📤 Submitting data:", apiData);
    onSubmit(apiData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-xl"
      >
        {isEdit && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              Note: Faculty and Study Forms cannot be changed when editing a
              direction. Only Name and Code can be modified.
            </p>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter direction name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter direction code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="faculty_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              {isEdit ? (
                <FormControl>
                  <Input
                    value={defaultValues?.faculty?.name || ""}
                    disabled={true}
                    className="bg-gray-50"
                    readOnly
                  />
                </FormControl>
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <div className="p-2 text-sm">Loading...</div>
                    ) : faculties.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No faculties
                      </div>
                    ) : (
                      faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={String(faculty.id)}>
                          {faculty.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {
          /* Study Forms Section */
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Study Forms</h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="has_full_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isEdit}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Full-time
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Full-time study form (day classes)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_part_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isEdit}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Part-time
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Part-time study form (evening/distance classes)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Общая ошибка валидации - только для создания */}
                {!isEdit && (
                  <FormMessage>
                    {form.formState.errors.has_full_time?.message}
                  </FormMessage>
                )}
              </div>
            </div>
          </div>
        }

        <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
