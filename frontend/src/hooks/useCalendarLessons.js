import { useQuery } from "@tanstack/react-query";
import { useProtectedFetch } from "./useProtectedFetch";

export function useCalendarLessons(scheduleId, dateFrom, dateTo) {
  const protectedFetch = useProtectedFetch();

  return useQuery({
    queryKey: ["calendar-lessons", scheduleId, dateFrom, dateTo],
    queryFn: async () => {
      if (!scheduleId) return { items: [], count: 0 };

      const queryParams = new URLSearchParams();
      queryParams.append("schedule_id", scheduleId.toString());
      if (dateFrom) queryParams.append("date_from", dateFrom);
      if (dateTo) queryParams.append("date_to", dateTo);

      const res = await protectedFetch(
        `http://localhost:8000/api/lesson/calendar?${queryParams.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch calendar lessons");
      return res.json();
    },
    enabled: !!scheduleId,
    keepPreviousData: true,
  });
}
