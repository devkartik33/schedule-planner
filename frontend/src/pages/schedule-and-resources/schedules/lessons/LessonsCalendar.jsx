import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./LessonsCalendar.css";

import { Users, User, MapPin } from "lucide-react";

// Настраиваем момент для начала недели с понедельника
moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week
  },
});

import { useCalendarLessons } from "@/hooks/useCalendarLessons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConflictsDropdown } from "./components/ConflictsDropdown";
import { WorkloadWarningsDropdown } from "./components/WorkloadWarningsDropdown";
import { EventComponent } from "./components/EventComponent";

// Импортируем все утилиты
import {
  getDateRange,
  createResourcesFromLessons,
  transformLessonsToEvents,
  darkenColor,
  createEventDropHandler,
  createEventResizeHandler,
  createNavigateToLessonsHandler,
  createNavigateToConflictHandler,
  createSelectEventHandler,
  createSelectSlotHandler,
  createNavigateHandler,
  createViewChangeHandler,
  logDebugInfo,
} from "./utils";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export function LessonsCalendar({
  schedule,
  onEditLesson,
  onUpdateLesson,
  onCreateLesson,
  refreshTrigger,
}) {
  const queryClient = useQueryClient();

  // Функции для инвалидации кеша
  const invalidateConflictsCache = () => {
    queryClient.invalidateQueries(["conflicts-summary", schedule?.id]);
  };

  const invalidateWorkloadCache = () => {
    queryClient.invalidateQueries(["local-workload-warnings", schedule?.id]);
  };

  // Состояние для навигации и вида календаря
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [groupBy, setGroupBy] = useState("none");

  // Вычисляем период для загрузки уроков
  const dateRange = getDateRange(currentDate, currentView);

  // Загружаем уроки для данного расписания и периода
  const {
    data: lessonsData,
    isLoading,
    refetch,
  } = useCalendarLessons(schedule?.id, dateRange.date_from, dateRange.date_to);

  const lessons = lessonsData?.items || [];

  // Создаем ресурсы и события
  const resources = createResourcesFromLessons(lessons, groupBy);
  const events = transformLessonsToEvents(lessons, groupBy);

  // Создаем обработчики
  const handleNavigateToLessons = createNavigateToLessonsHandler(
    setCurrentDate,
    setCurrentView
  );
  const handleNavigateToConflict = createNavigateToConflictHandler(
    setCurrentDate,
    setCurrentView
  );
  const handleSelectEvent = createSelectEventHandler(onEditLesson);
  const handleSelectSlot = createSelectSlotHandler(onCreateLesson);
  const handleNavigate = createNavigateHandler(setCurrentDate);
  const handleViewChange = createViewChangeHandler(setCurrentView);

  const handleEventDrop = createEventDropHandler(
    lessons,
    schedule,
    groupBy,
    onUpdateLesson,
    refetch,
    invalidateConflictsCache,
    invalidateWorkloadCache
  );

  const handleEventResize = createEventResizeHandler(
    schedule,
    onUpdateLesson,
    refetch,
    invalidateConflictsCache,
    invalidateWorkloadCache
  );

  // Рефетч данных при изменении refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Рефетч при изменении даты или вида календаря
  useEffect(() => {
    refetch();
  }, [currentDate, currentView, refetch]);

  // Отладочная информация
  useEffect(() => {
    logDebugInfo(currentView, groupBy, lessons, resources, events);
  }, [lessons, groupBy, currentView, resources, events]);

  if (isLoading) {
    return (
      <div className="h-[700px] bg-background border rounded-lg p-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading lessons...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background flex justify-between gap-4 flex-wrap border rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Schedule View</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Group by:</span>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="flex items-center gap-2">
                    📋 No Grouping
                  </span>
                </SelectItem>
                <SelectItem value="group">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    By Group
                  </span>
                </SelectItem>
                <SelectItem value="professor">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    By Professor
                  </span>
                </SelectItem>
                <SelectItem value="room">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    By Room/Online
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {lessons.length} lessons scheduled
            {resources && ` • ${resources.length} ${groupBy}s`}
          </div>

          <div className="flex gap-2">
            <WorkloadWarningsDropdown
              onNavigateToLessons={handleNavigateToLessons}
            />
            <ConflictsDropdown
              onNavigateToConflict={handleNavigateToConflict}
            />
          </div>
        </div>
      </div>

      {/* Календарь */}
      <div className="h-[700px] max-w-[1200px] relative bg-background border rounded-lg p-4">
        <DnDCalendar
          localizer={localizer}
          events={events}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          views={["week", "day"]}
          view={currentView}
          date={currentDate}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          step={30}
          timeslots={2}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          showMultiDayTimes
          scrollToTime={new Date(1970, 1, 1, 8)}
          min={new Date(1970, 1, 1, 8, 0, 0)} // 8:00 AM
          max={new Date(1970, 1, 1, 22, 0, 0)} // 10:00 PM
          // DnD пропсы
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          draggableAccessor={() => true}
          // Важно: включаем группировку ресурсов для недельного вида
          // resourceGroupingLayout={currentView === "week" && groupBy !== "none"}
          components={{
            event: (eventProps) => (
              <EventComponent {...eventProps} groupBy={groupBy} />
            ),
          }}
          eventPropGetter={(event) => {
            // Всегда используем только цвет предмета
            const subjectColor = event.resource.lesson.subject?.color || "#000"; // fallback на серый
            const borderColor = darkenColor(subjectColor, 0.2);

            return {
              style: {
                backgroundColor: subjectColor,
                borderColor: borderColor,
                color: "white",
                fontSize: "12px",
              },
            };
          }}
          messages={{
            allDay: "All Day",
            previous: "<",
            next: ">",
            today: "Today",
            week: "Week",
            day: "Day",
            date: "Date",
            time: "Time",
            event: "Lesson",
            noEventsInRange: "No lessons scheduled for this period.",
            showMore: (total) => `+${total} more`,
          }}
        />
      </div>
    </>
  );
}
