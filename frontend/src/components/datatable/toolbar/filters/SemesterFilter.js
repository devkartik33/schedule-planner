import { useDependentFilter } from "./useDependentFilter";

/**
 * Фильтр по семестрам с каскадной зависимостью от академических годов и периодов
 * Показывает только семестры выбранных академических годов и периодов
 */
export const useSemesterFilter = () => {
  return useDependentFilter({
    entity: "semester",
    key: "semester_ids",
    label: "Semester",
    valueField: "id",
    labelField: "name",
    dependsOn: ["academic_year_ids", "periods"],
    filterPredicate: (semester, currentFilters) => {
      const selectedYearIds = currentFilters.academic_year_ids || [];
      const selectedPeriods = currentFilters.periods || [];

      // Фильтруем по выбранным годам
      if (
        selectedYearIds.length > 0 &&
        !selectedYearIds.includes(semester.academic_year.id)
      ) {
        return false;
      }

      // Фильтруем по выбранным периодам
      if (
        selectedPeriods.length > 0 &&
        !selectedPeriods.includes(semester.period)
      ) {
        return false;
      }

      return true;
    },
    customLabelFormatter: (semester) => {
      return `${semester.name} (${semester.period})`;
    },
  });
};
