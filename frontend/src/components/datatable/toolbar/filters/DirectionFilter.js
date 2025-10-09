import { useDependentFilter } from "./useDependentFilter";

/**
 * Фильтр по направлениям с каскадной зависимостью от факультетов
 * Показывает только направления выбранных факультетов
 */
export const useDirectionFilter = () => {
  return useDependentFilter({
    entity: "direction",
    key: "direction_ids",
    label: "Direction",
    valueField: "id",
    labelField: "name",
    dependsOn: ["faculty_ids"],
    filterPredicate: (direction, currentFilters) => {
      const selectedFacultyIds = currentFilters.faculty_ids || [];
      // Если выбраны факультеты, показываем только их направления
      // Если ничего не выбрано, показываем все направления
      if (selectedFacultyIds.length === 0) return true;
      return selectedFacultyIds.includes(direction.faculty?.id);
    },
  });
};
