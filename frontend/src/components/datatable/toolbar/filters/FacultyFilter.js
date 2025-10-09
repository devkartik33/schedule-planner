import { useIndependentFilter } from "./useIndependentFilter";

/**
 * Фильтр по факультетам
 * Загружает список факультетов и создает фильтр для множественного выбора
 */
export const useFacultyFilter = () => {
  return useIndependentFilter({
    entity: "faculty",
    key: "faculty_ids",
    label: "Faculty",
    valueField: "id",
    labelField: "name",
  });
};
