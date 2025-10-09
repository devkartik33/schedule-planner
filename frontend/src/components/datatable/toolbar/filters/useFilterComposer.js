import { useMemo } from "react";

/**
 * Композитор для объединения нескольких фильтров в единую схему
 * @param {Array} filterHooks - массив хуков фильтров с их конфигурациями
 * @param {Object} currentFilters - текущие значения фильтров
 */
export const useFilterComposer = (filterHooks, currentFilters = {}) => {
  const allData = filterHooks.map((hook) => hook());

  const isLoading = allData.some((data) => data.isLoading);
  const hasError = allData.some((data) => data.error);

  const filterSchema = useMemo(() => {
    // Возвращаем функцию, которая принимает currentFilters
    return (currentFilters) => {
      if (isLoading) return [];

      const filters = [];
      const addedFilterKeys = new Set();

      // Проходим по хукам в исходном порядке
      // Добавляем фильтры, у которых все зависимости уже добавлены
      let changed = true;
      while (changed && filters.length < allData.length) {
        changed = false;

        allData.forEach((hookData, index) => {
          const filter = hookData.createFilter(currentFilters);

          if (!filter) return;

          // Проверяем, не добавлен ли уже этот фильтр
          if (addedFilterKeys.has(filter.key)) return;

          // Проверяем зависимости
          const dependsOn = filter.dependsOn || [];
          const dependenciesSatisfied = dependsOn.every((dep) =>
            addedFilterKeys.has(dep)
          );

          if (dependenciesSatisfied) {
            filters.push(filter);
            addedFilterKeys.add(filter.key);
            changed = true;
          }
        });
      }

      return filters;
    }; // Закрываем функцию
  }, [allData, isLoading]); // Убираем currentFilters из зависимостей

  return {
    filterSchema,
    isLoading,
    hasError,
  };
};
