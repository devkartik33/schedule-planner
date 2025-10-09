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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEntityList } from "@/hooks/useEntityList";
import { useEffect } from "react";

const createSchema = (isEdit) => {
  if (isEdit) {
    // При редактировании только name обязательно
    return z.object({
      name: z.string().min(1, "Schedule name is required"),
      academic_year_id: z.string().optional(),
      semester_id: z.string().optional(),
      direction_id: z.string().optional(),
    });
  }

  // При создании все поля обязательны
  return z.object({
    name: z.string().min(1, "Schedule name is required"),
    academic_year_id: z.string().min(1, "Academic year is required"),
    semester_id: z.string().min(1, "Semester is required"),
    direction_id: z.string().min(1, "Direction is required"),
  });
};

export default function ScheduleForm({
  id,
  defaultValues,
  isEdit = false,
  isLoading = false,
  onSubmit,
  showButtons = true,
}) {
  const transformedDefaultValues = {
    name: defaultValues?.name || "",
    academic_year_id: String(defaultValues?.semester?.academic_year?.id ?? ""),
    semester_id: String(defaultValues?.semester?.id ?? ""),
    direction_id: String(defaultValues?.direction?.id ?? ""),
  };

  const form = useForm({
    resolver: zodResolver(createSchema(isEdit)),
    defaultValues: transformedDefaultValues,
  });

  // Следим за изменением академического года
  const watchedAcademicYearId = form.watch("academic_year_id");

  // Загружаем академические года
  const { data: academicYearsData, isLoading: isAcademicYearsLoading } =
    useEntityList("academic_year");
  const academicYears = academicYearsData?.items || [];

  // Загружаем семестры для выбранного академического года
  const { data: semestersData, isLoading: isSemestersLoading } = useEntityList(
    "semester",
    watchedAcademicYearId
      ? { filters: { academic_year_ids: [watchedAcademicYearId] } }
      : {}
  );
  const semesters = semestersData?.items || [];

  // Загружаем направления
  const { data: directionsData, isLoading: isDirectionsLoading } =
    useEntityList("direction");
  const directions = directionsData?.items || [];

  // Очищаем семестр при смене академического года
  useEffect(() => {
    if (watchedAcademicYearId && !isEdit) {
      form.setValue("semester_id", "");
    }
  }, [watchedAcademicYearId, form, isEdit]);

  // Заполняем форму при редактировании
  useEffect(() => {
    if (isEdit && defaultValues) {
      const newValues = {
        name: defaultValues.name || "",
        academic_year_id: String(defaultValues.academic_year?.id ?? ""),
        semester_id: String(defaultValues.semester?.id ?? ""),
        direction_id: String(defaultValues.direction?.id ?? ""),
      };
      form.reset(newValues);
    }
  }, [defaultValues, isEdit, form]);

  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter schedule name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="academic_year_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              {isEdit ? (
                <FormControl>
                  <Input
                    value={defaultValues?.academic_year?.name || ""}
                    disabled={true}
                    className="bg-gray-50"
                    readOnly
                  />
                </FormControl>
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {isAcademicYearsLoading ? (
                      <div className="p-2 text-sm">Loading...</div>
                    ) : academicYears.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No academic years found
                      </div>
                    ) : (
                      academicYears.map((year) => (
                        <SelectItem key={year.id} value={String(year.id)}>
                          {year.name}
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

        <FormField
          control={form.control}
          name="semester_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              {isEdit ? (
                <FormControl>
                  <Input
                    value={
                      defaultValues?.semester
                        ? `Semester ${defaultValues.semester.number} ${defaultValues.semester.period}`
                        : ""
                    }
                    disabled={true}
                    className="bg-gray-50"
                    readOnly
                  />
                </FormControl>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!watchedAcademicYearId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        watchedAcademicYearId
                          ? "Select semester"
                          : "Select academic year first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isSemestersLoading ? (
                      <div className="p-2 text-sm">Loading...</div>
                    ) : semesters.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        {watchedAcademicYearId
                          ? "No semesters for selected year"
                          : "Select academic year first"}
                      </div>
                    ) : (
                      semesters.map((semester) => (
                        <SelectItem
                          key={semester.id}
                          value={String(semester.id)}
                        >
                          Semester {semester.number} {semester.period}
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

        <FormField
          control={form.control}
          name="direction_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direction</FormLabel>
              {isEdit ? (
                <FormControl>
                  <Input
                    value={defaultValues?.direction?.name || ""}
                    disabled={true}
                    className="bg-gray-50"
                    readOnly
                  />
                </FormControl>
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {isDirectionsLoading ? (
                      <div className="p-2 text-sm">Loading...</div>
                    ) : directions.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No directions found
                      </div>
                    ) : (
                      directions.map((direction) => (
                        <SelectItem
                          key={direction.id}
                          value={String(direction.id)}
                        >
                          {direction.name}
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

        {showButtons && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"} Schedule
          </Button>
        )}
      </form>
    </Form>
  );
}
