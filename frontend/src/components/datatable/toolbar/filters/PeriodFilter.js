/**
 * Независимый фильтр по периодам (статические опции)
 * Используется когда периоды должны быть независимыми от других фильтров
 */
export const usePeriodFilter = () => {
  return {
    createFilter: (currentFilters) => {
      return {
        key: "periods",
        label: "Period",
        options: [
          { key: "winter", value: "winter", label: "Winter" },
          { key: "summer", value: "summer", label: "Summer" },
        ],
      };
    },
    isLoading: false,
    error: null,
    data: null,
  };
};
