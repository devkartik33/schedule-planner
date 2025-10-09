import { useEntityList } from "@/hooks/useEntityList";

/**
 * Хук для создания независимых фильтров
 * @param {Object} config - конфигурация фильтра
 * @param {string} config.entity - название сущности для загрузки данных
 * @param {string} config.key - ключ фильтра (например, 'faculty_ids')
 * @param {string} config.label - отображаемое название фильтра
 * @param {string} config.valueField - поле для value (по умолчанию 'id')
 * @param {string} config.labelField - поле для label (по умолчанию 'name')
 * @param {Function} config.customLabelFormatter - функция для кастомного форматирования label
 */
export const useIndependentFilter = (config) => {
  const {
    entity,
    key,
    label,
    valueField = "id",
    labelField = "name",
    customLabelFormatter,
  } = config;

  const { data, isLoading, error } = useEntityList(entity);

  const createFilter = (currentFilters) => {
    if (!data?.items?.length) return null;

    const filter = {
      key,
      label,
      options: data.items.map((item) => ({
        key: item[valueField],
        value: item[valueField],
        label: customLabelFormatter
          ? customLabelFormatter(item)
          : item[labelField],
      })),
    };

    return filter;
  };

  return {
    createFilter,
    isLoading,
    error,
    data,
  };
};
