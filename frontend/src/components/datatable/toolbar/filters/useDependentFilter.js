import { useEntityList } from "@/hooks/useEntityList";

/**
 * Хук для создания зависимых фильтров
 * @param {Object} config - конфигурация фильтра
 * @param {string} config.entity - название сущности для загрузки данных
 * @param {string} config.key - ключ фильтра (например, 'direction_ids')
 * @param {string} config.label - отображаемое название фильтра
 * @param {string} config.valueField - поле для value (по умолчанию 'id')
 * @param {string} config.labelField - поле для label (по умолчанию 'name')
 * @param {Array} config.dependsOn - массив ключей фильтров от которых зависит этот фильтр
 * @param {Function} config.filterPredicate - функция фильтрации items на основе выбранных значений dependsOn
 * @param {Function} config.customLabelFormatter - функция для кастомного форматирования label
 * @param {boolean} config.extractUnique - если true, извлекает уникальные значения из поля valueField
 */
export const useDependentFilter = (config) => {
  const {
    entity,
    key,
    label,
    valueField = "id",
    labelField = "name",
    dependsOn = [],
    filterPredicate,
    customLabelFormatter,
    extractUnique = false,
  } = config;

  const { data, isLoading, error } = useEntityList(entity);

  const createFilter = (currentFilters) => {
    if (!data?.items?.length) return null;

    // Проверяем зависимости и фильтруем данные
    let filteredItems = data.items;

    if (dependsOn.length > 0 && filterPredicate) {
      filteredItems = data.items.filter((item) =>
        filterPredicate(item, currentFilters)
      );
    }

    if (filteredItems.length === 0) return null;

    let options;

    if (extractUnique) {
      // Извлекаем уникальные значения из поля valueField
      const uniqueValues = [
        ...new Set(filteredItems.map((item) => item[valueField])),
      ];
      options = uniqueValues.map((value) => ({
        key: value,
        value: value,
        label: customLabelFormatter
          ? customLabelFormatter({ [valueField]: value, [labelField]: value })
          : value.charAt(0).toUpperCase() + value.slice(1),
      }));
    } else {
      options = filteredItems.map((item) => ({
        key: item[valueField],
        value: item[valueField],
        label: customLabelFormatter
          ? customLabelFormatter(item)
          : item[labelField],
      }));
    }

    const filter = {
      key,
      label,
      options,
      dependsOn,
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
