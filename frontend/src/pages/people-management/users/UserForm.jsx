// components/users/UserForm.jsx
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

const schema = z
  .object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
    password: z.string().optional(),
    role: z.enum(["admin", "coordinator", "user"]),
    user_type: z.union([
      z.literal(""),
      z.literal("student"),
      z.literal("professor"),
    ]),
    academic_year_id: z.string().optional(),
    semester_id: z.string().optional(),
    group_id: z.string().optional(),
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    path: ["password"],
    message: "Password must be at least 6 characters",
  });

export function UserForm({
  defaultValues,
  isEdit = false,
  onSubmit,
  showButtons = true,
  isLoading = false,
}) {
  // Преобразуем данные из API формата в формат формы
  const transformedDefaultValues = {
    name: defaultValues?.name || "",
    surname: defaultValues?.surname || "",
    email: defaultValues?.email || "",
    password: "",
    role: defaultValues?.role || "",
    user_type: defaultValues?.user_type || "",
    academic_year_id: String(
      defaultValues?.student_profile?.academic_year?.id ?? ""
    ),
    semester_id: String(defaultValues?.student_profile?.semester?.id ?? ""),
    group_id: String(defaultValues?.student_profile?.group?.id ?? ""),
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: transformedDefaultValues,
  });

  const role = form.watch("role");
  const userType = form.watch("user_type");
  const watchedAcademicYearId = form.watch("academic_year_id");
  const watchedSemesterId = form.watch("semester_id");

  // Загружаем академические годы
  const { data: academicYearsData, isLoading: academicYearsLoading } =
    useEntityList("academic_year");
  const academicYears = academicYearsData?.items || [];

  // Загружаем семестры для выбранного академического года
  const { data: semestersData, isLoading: semestersLoading } = useEntityList(
    "semester",
    watchedAcademicYearId
      ? { filters: { academic_year_ids: [watchedAcademicYearId] } }
      : {} // 🔥 Изменили на null чтобы не загружать если нет года
  );
  const semesters = semestersData?.items || [];

  // Загружаем группы для выбранного семестра
  const { data: groupsData, isLoading: groupsLoading } = useEntityList(
    "group",
    watchedSemesterId ? { filters: { semester_ids: [watchedSemesterId] } } : {} // 🔥 Изменили на null чтобы не загружать если нет семестра
  );
  const groups = groupsData?.items || [];

  // Очищаем зависимые поля при изменении родительских
  const handleAcademicYearChange = (value) => {
    form.setValue("academic_year_id", value);
    form.setValue("semester_id", ""); // Очищаем семестр при смене года
    form.setValue("group_id", ""); // Очищаем группу при смене года
  };

  const handleSemesterChange = (value) => {
    form.setValue("semester_id", value);
    form.setValue("group_id", ""); // Очищаем группу при смене семестра
  };

  return (
    <Form {...form}>
      <form
        id="user-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-6 ${showButtons ? "max-w-xl" : ""}`}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          {["name", "surname", "email", "password"].map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>
                    {field[0].toUpperCase() + field.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={field === "password" ? "password" : "text"}
                      placeholder={
                        field === "name"
                          ? "Enter first name"
                          : field === "surname"
                          ? "Enter last name"
                          : field === "email"
                          ? "Enter email address"
                          : field === "password"
                          ? "Enter password"
                          : ""
                      }
                      {...f}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">User Role and Type</h3>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {["admin", "coordinator", "user"].map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {role === "user" && (
            <FormField
              control={form.control}
              name="user_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {role === "user" && userType === "student" && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Student Profile</h3>

            <FormField
              control={form.control}
              name="academic_year_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <Select
                    onValueChange={handleAcademicYearChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYearsLoading ? (
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
                  <Select
                    onValueChange={handleSemesterChange}
                    value={field.value || ""}
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
                      {semestersLoading ? (
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={!watchedSemesterId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          watchedSemesterId
                            ? "Select group"
                            : "Select semester first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {groupsLoading ? (
                        <div className="p-2 text-sm">Loading...</div>
                      ) : groups.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          {watchedSemesterId
                            ? "No groups for selected semester"
                            : "Select semester first"}
                        </div>
                      ) : (
                        groups.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {showButtons && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        )}
      </form>
    </Form>
  );
}
