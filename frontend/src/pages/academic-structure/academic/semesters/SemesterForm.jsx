import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DatePicker } from "@/components/ui/date-picker";
import { useEntityList } from "@/hooks/useEntityList";

export const SemesterForm = ({
  defaultValues,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  // Создаем схему динамически в зависимости от режима
  const createSchema = (isEditMode) => {
    const baseSchema = {
      name: z.string().min(1, "Semester name is required"),
      number: z.coerce.number().int().min(1, "Number is required"),
      period: z.enum(["winter", "spring", "summer"], {
        errorMap: () => ({ message: "Period is required" }),
      }),
      start_date: z.string().min(1, "Start date is required"),
      end_date: z.string().min(1, "End date is required"),
    };

    // Добавляем academic_year_id только при создании
    if (!isEditMode) {
      baseSchema.academic_year_id = z
        .string()
        .min(1, "Academic year is required");
    }

    return z.object(baseSchema).refine(
      (data) => {
        if (data.start_date && data.end_date) {
          return new Date(data.end_date) >= new Date(data.start_date);
        }
        return true;
      },
      {
        message: "End date must be after or equal to start date",
        path: ["end_date"],
      }
    );
  };

  const form = useForm({
    resolver: zodResolver(createSchema(isEdit)),
    defaultValues,
  });

  const { data: academicYears, isLoading: isLoadingYears } =
    useEntityList("academic_year");

  console.log(academicYears);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Semester 3 winter 2024-2025"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Year только при создании */}
        {!isEdit && (
          <FormField
            control={form.control}
            name="academic_year_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingYears ? (
                      <div className="p-2 text-sm">Loading...</div>
                    ) : academicYears?.items?.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No academic years found
                      </div>
                    ) : (
                      academicYears?.items?.map((year) => (
                        <SelectItem key={year.id} value={String(year.id)}>
                          {year.name} {year.is_current && "(Current)"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <DatePicker
                    modal={true}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <DatePicker
                    modal={true}
                    value={field.value}
                    onChange={field.onChange}
                    minDate={form.watch("start_date")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
