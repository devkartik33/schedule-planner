import { useIndependentFilter } from "./useIndependentFilter";

/**
 * Фильтр по академическим годам (независимый фильтр)
 */
export const useAcademicYearFilter = () => {
  return useIndependentFilter({
    entity: "academic_year",
    key: "academic_year_ids",
    label: "Academic Year",
    valueField: "id",
    labelField: "name",
  });
};
