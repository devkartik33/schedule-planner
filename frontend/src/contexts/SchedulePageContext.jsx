import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProtectedFetch } from "@/hooks/useProtectedFetch";

const SchedulePageContext = createContext();

export function SchedulePageProvider({ children, schedule }) {
  const protectedFetch = useProtectedFetch();

  // Основные данные конфликтов
  const { data: conflictsData, isLoading: conflictsLoading } = useQuery({
    queryKey: ["conflicts-summary", schedule?.id],
    queryFn: async () => {
      if (!schedule?.id) return null;

      const queryParams = new URLSearchParams();
      queryParams.append("schedule_id", schedule.id);

      const res = await protectedFetch(
        `http://localhost:8000/api/lesson/conflicts/summary?${queryParams.toString()}`
      );

      if (!res.ok) throw new Error("Failed to fetch conflicts");
      return res.json();
    },
    enabled: !!schedule?.id,
    staleTime: 30000, // Кешируем на 30 секунд
  });

  // Данные предупреждений о превышении часов
  const { data: workloadWarningsData, isLoading: workloadLoading } = useQuery({
    queryKey: ["local-workload-warnings", schedule?.id],
    queryFn: async () => {
      if (!schedule?.id) return null;

      const res = await protectedFetch(
        `http://localhost:8000/api/professor_workload/warnings/local/${schedule.id}`
      );

      if (!res.ok) throw new Error("Failed to fetch workload warnings");
      return res.json();
    },
    enabled: !!schedule?.id,
    staleTime: 30000,
  });

  // Получаем группы, задействованные в расписании
  const { data: scheduleGroupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["schedule-groups", schedule?.id],
    queryFn: async () => {
      if (!schedule?.id) return null;

      const res = await protectedFetch(
        `http://localhost:8000/api/lesson/groups?schedule_id=${schedule.id}`
      );

      if (!res.ok) throw new Error("Failed to fetch schedule groups");
      return res.json();
    },
    enabled: !!schedule?.id,
    staleTime: 60000, // Группы меняются реже
  });

  // Производные данные
  const conflictsSummary = conflictsData || {};
  const { single = [], shared = [], total_conflicts = 0 } = conflictsSummary;

  const workloadWarnings = workloadWarningsData?.warnings || [];
  const totalWarnings = workloadWarningsData?.total_warnings || 0;

  const scheduleGroups = scheduleGroupsData?.groups || [];
  const groupsInvolved = scheduleGroups; // Алиас для совместимости

  const hasConflicts = total_conflicts > 0;
  const hasWorkloadIssues = totalWarnings > 0;
  const hasIssues = hasConflicts || hasWorkloadIssues;

  const isLoading = conflictsLoading || workloadLoading || groupsLoading;

  const value = {
    // Данные
    schedule,
    conflictsData: conflictsSummary,
    conflicts: conflictsSummary, // Алиас для совместимости
    workloadWarnings,
    scheduleGroups,
    groupsInvolved,

    // Производные состояния
    hasConflicts,
    hasWorkloadIssues,
    hasIssues,
    totalConflicts: total_conflicts,
    totalWarnings,

    // Загрузка
    isLoading,
    conflictsLoading,
    workloadLoading,
    groupsLoading,

    // Детализированные данные
    singleConflicts: single,
    sharedConflicts: shared,
  };

  return (
    <SchedulePageContext.Provider value={value}>
      {children}
    </SchedulePageContext.Provider>
  );
}

export function useSchedulePageData() {
  const context = useContext(SchedulePageContext);
  if (!context) {
    throw new Error(
      "useSchedulePageData must be used within SchedulePageProvider"
    );
  }
  return context;
}
