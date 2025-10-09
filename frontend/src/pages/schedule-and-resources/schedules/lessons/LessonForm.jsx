import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Users,
  Laptop,
  Building2,
  FlaskConical,
  MessageSquare,
  Presentation,
} from "lucide-react";
import { toast } from "sonner";
import { useEntityList } from "@/hooks/useEntityList";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function LessonForm({
  lesson,
  schedule,
  onSave,
  onCancel,
  onDelete,
  isEdit = false,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Трансформируем данные урока для формы
  const getDefaultValues = useCallback(() => {
    if (lesson && isEdit) {
      return {
        schedule_id: schedule?.id || lesson.schedule?.id,
        group_id: lesson.group?.id?.toString() || "",
        subject_assignment_id: lesson.subject_assignment_id?.toString() || "",
        room_id: lesson.room?.id?.toString() || "",
        is_online: lesson.is_online || false,
        date: lesson.date || "",
        start_time: lesson.start_time || "",
        end_time: lesson.end_time || "",
        lesson_type: lesson.lesson_type || "lecture",

        workload_id: lesson.workload?.id?.toString() || "",
      };
    }

    // Для создания урока - используем данные из lesson или дефолтные значения
    return {
      schedule_id: schedule?.id,
      group_id: "",
      subject_assignment_id: "",
      room_id: "",
      is_online: false,
      date: lesson?.date || "",
      start_time: lesson?.start_time || "",
      end_time: lesson?.end_time || "",
      lesson_type: "lecture",
      workload_id: "",
    };
  }, [lesson, schedule, isEdit]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(),
  });

  // Сбрасываем форму когда меняется урок
  useEffect(() => {
    reset(getDefaultValues());
  }, [lesson, getDefaultValues, reset]);

  // Отслеживаемые поля для каскадной фильтрации
  const watchedGroupId = watch("group_id");
  const watchedWorkloadId = watch("workload_id");
  const watchedIsOnline = watch("is_online");
  const watchedDate = watch("date");
  const watchedStartTime = watch("start_time");
  const watchedEndTime = watch("end_time");

  // 1. Группы: фильтруем по semester_id и direction_id из schedule
  const { data: groupsData } = useEntityList("group", {
    filters: schedule
      ? {
          semester_ids: [schedule.semester.id],
          direction_ids: [schedule.direction.id],
        }
      : {},
    pagination: { loadAll: true },
  });
  const groups = groupsData?.items || [];

  // Получаем выбранную группу для следующего фильтра
  const selectedGroup = groups.find((g) => g.id === parseInt(watchedGroupId));

  // 2. Workloads: фильтруем по семестру, направлению из schedule и study_form из группы
  const { data: workloadsData } = useEntityList("professor_workload", {
    filters:
      schedule && (selectedGroup || (isEdit && lesson?.group))
        ? {
            semester_ids: [schedule.semester.id],
            direction_ids: [schedule.direction.id],
            study_forms: [
              (selectedGroup || (isEdit && lesson?.group))?.study_form?.form,
            ],
          }
        : {},

    pagination: { loadAll: true },
  });
  const workloads = workloadsData?.items || [];

  // 3. Subject assignments: фильтруем по выбранному workload_id
  const currentWorkloadId =
    watchedWorkloadId || (isEdit && lesson?.workload?.id);
  const { data: assignmentsData } = useEntityList("subject_assignment", {
    filters: currentWorkloadId
      ? {
          workload_id: currentWorkloadId,
        }
      : {},

    pagination: { loadAll: true },
  });
  const assignments = assignmentsData?.items || [];

  // 4. Комнаты: фильтруем по доступности в указанное время
  const roomFilters = {};

  // Если указаны дата и время, добавляем фильтры доступности
  if (watchedDate && watchedStartTime && watchedEndTime && !watchedIsOnline) {
    roomFilters.available_date = watchedDate;
    roomFilters.available_start_time = watchedStartTime;
    roomFilters.available_end_time = watchedEndTime;

    // При редактировании исключаем текущий урок
    if (isEdit && lesson?.id) {
      roomFilters.exclude_lesson_id = lesson.id;
    }
  }

  const { data: roomsData } = useEntityList("room", {
    filters: roomFilters,
    pagination: { loadAll: true },
  });
  const rooms = roomsData?.items || [];

  // Сброс формы при изменении lesson (для редактирования)
  useEffect(() => {
    const values = getDefaultValues();
    reset(values);

    // Принудительно устанавливаем workload_id после небольшой задержки
    if (isEdit && lesson?.workload?.id) {
      const timeoutId = setTimeout(() => {
        const workloadIdString = lesson.workload.id.toString();
        console.log("Setting workload_id via setTimeout:", workloadIdString);
        setValue("workload_id", workloadIdString);
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [lesson, isEdit, reset, getDefaultValues, setValue]);

  // Очистка зависимых полей при изменении родительских
  useEffect(() => {
    if (!isEdit) {
      // Только для создания новых уроков
      setValue("workload_id", "");
      setValue("subject_assignment_id", "");
    }
  }, [watchedGroupId, setValue, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      setValue("subject_assignment_id", "");
    }
  }, [watchedWorkloadId, setValue, isEdit]);

  // Очистка комнаты при изменении даты/времени (если не онлайн)
  useEffect(() => {
    if (!isEdit && !watchedIsOnline) {
      setValue("room_id", "");
    }
  }, [
    watchedDate,
    watchedStartTime,
    watchedEndTime,
    watchedIsOnline,
    setValue,
    isEdit,
  ]);

  // Дополнительный эффект для установки workload_id когда данные workloads загружены
  useEffect(() => {
    if (
      isEdit &&
      lesson?.workload?.id &&
      workloads.length > 0 &&
      !watchedWorkloadId
    ) {
      const workloadIdString = lesson.workload.id.toString();
      const workloadExists = workloads.find(
        (w) => w.id.toString() === workloadIdString
      );

      if (workloadExists) {
        console.log(
          "Setting workload_id from workloads effect:",
          workloadIdString
        );
        setValue("workload_id", workloadIdString);
      }
    }
  }, [isEdit, lesson, workloads, watchedWorkloadId, setValue]);

  const handleFormSubmit = async (data) => {
    try {
      // Преобразуем строковые ID в числа для API
      const transformedData = {
        ...data,
        schedule_id: parseInt(data.schedule_id),
        group_id: data.group_id ? parseInt(data.group_id) : null,
        subject_assignment_id: data.subject_assignment_id
          ? parseInt(data.subject_assignment_id)
          : null,
        room_id: data.room_id ? parseInt(data.room_id) : null,
      };

      // Удаляем workload_id из данных, он нужен только для UI
      delete transformedData.workload_id;

      await onSave(transformedData);
      toast.success(isEdit ? "Lesson updated" : "Lesson created");
    } catch (error) {
      toast.error(error.message || "Failed to save lesson");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(lesson.id);
    setShowDeleteConfirm(false);
  };

  const lessonTypes = [
    { value: "lecture", label: "Lecture", icon: Presentation },
    { value: "practice", label: "Practice", icon: Laptop },
    { value: "lab", label: "Laboratory", icon: FlaskConical },
    { value: "seminar", label: "Seminar", icon: MessageSquare },
  ];

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {isEdit ? "Edit lesson" : "Add lesson"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Group Selection */}
        <Card>
          <CardContent className="pt-3 space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Selection
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Group
              </label>
              <Select
                value={watch("group_id")}
                onValueChange={(value) => setValue("group_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No groups found for this schedule
                    </div>
                  ) : (
                    groups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                        {group.study_form && (
                          <Badge variant="outline" className="ml-2">
                            {group.study_form.form}
                          </Badge>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.group_id && (
                <p className="text-sm text-red-500">
                  {errors.group_id.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professor & Subject Selection */}
        <Card>
          <CardContent className="pt-3 space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Professor & Subject
            </h3>

            {/* Workload selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Professor (Workload)
              </label>
              <Select
                value={watch("workload_id")}
                onValueChange={(value) => setValue("workload_id", value)}
                disabled={!watchedGroupId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      watchedGroupId ? "Select professor" : "Select group first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {workloads.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      {!watchedGroupId
                        ? "Select group first"
                        : "No professors found for selected group"}
                    </div>
                  ) : (
                    workloads.map((workload) => (
                      <SelectItem
                        key={workload.id}
                        value={workload.id.toString()}
                      >
                        {workload?.professor.name} {workload?.professor.surname}
                        <span className="text-sm text-gray-500 ml-2">
                          ({workload.assigned_hours}h)
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.workload_id && (
                <p className="text-sm text-red-500">
                  {errors.workload_id.message}
                </p>
              )}
            </div>

            {/* Subject assignment selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subject
              </label>
              <Select
                value={watch("subject_assignment_id")}
                onValueChange={(value) =>
                  setValue("subject_assignment_id", value)
                }
                disabled={!watchedWorkloadId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      watchedWorkloadId
                        ? "Select subject"
                        : "Select professor first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {assignments.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      {!watchedWorkloadId
                        ? "Select professor first"
                        : "No subjects found for selected professor"}
                    </div>
                  ) : (
                    assignments.map((assignment) => (
                      <SelectItem
                        key={assignment.id}
                        value={assignment.id.toString()}
                      >
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {assignment.subject?.name} ({assignment.subject?.code}
                          )
                          <span className="text-sm text-gray-500 ml-2">
                            {assignment.hours_per_subject}h
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.subject_assignment_id && (
                <p className="text-sm text-red-500">
                  {errors.subject_assignment_id.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Type */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium">Lesson Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {lessonTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant={
                      watch("lesson_type") === type.value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setValue("lesson_type", type.value)}
                    className="justify-start"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Date and Time */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </label>
                <DatePicker
                  value={watch("date")}
                  onChange={(value) => setValue("date", value)}
                  modal={true}
                  placeholder="Select date"
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              {/* Start time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start time</label>
                <Input
                  type="time"
                  step="1"
                  {...register("start_time", {
                    required: "Specify start time",
                  })}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {errors.start_time && (
                  <p className="text-sm text-red-500">
                    {errors.start_time.message}
                  </p>
                )}
              </div>

              {/* End time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">End time</label>
                <Input
                  type="time"
                  step="1"
                  {...register("end_time", {
                    required: "Specify end time",
                  })}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {errors.end_time && (
                  <p className="text-sm text-red-500">
                    {errors.end_time.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>

            {/* Online toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_online"
                checked={watchedIsOnline}
                onCheckedChange={(checked) => setValue("is_online", checked)}
              />
              <label htmlFor="is_online" className="text-sm font-medium">
                Online lesson
              </label>
            </div>

            {/* Room (if not online) */}
            {!watchedIsOnline && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Room
                </label>
                <Select
                  value={watch("room_id")}
                  onValueChange={(value) => setValue("room_id", value)}
                  disabled={
                    !watchedDate || !watchedStartTime || !watchedEndTime
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !watchedDate || !watchedStartTime || !watchedEndTime
                          ? "Set date and time first"
                          : "Select available room"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        {!watchedDate || !watchedStartTime || !watchedEndTime
                          ? "Set date and time to see available rooms"
                          : "No rooms available at this time"}
                      </div>
                    ) : (
                      rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            {room.number}
                            <span className="text-sm text-gray-500 ml-2">
                              (capacity: {room.capacity})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.room_id && (
                  <p className="text-sm text-red-500">
                    {errors.room_id.message}
                  </p>
                )}
              </div>
            )}

            {watchedIsOnline && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  Lesson will be conducted online
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="flex justify-between">
          <div>
            {isEdit && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>{lesson && isEdit ? "Update" : "Create"}</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        message="Are you sure you want to delete this lesson?"
      />
    </DialogContent>
  );
}
