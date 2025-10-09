/**
 * Фильтр по формам обучения (статический - не загружается с сервера)
 */
export const useStudyFormFilter = () => {
  const createFilter = (currentFilters) => {
    const filter = {
      key: "study_forms",
      label: "Study Form",
      options: [
        { key: "full-time", value: "full-time", label: "Full-time" },
        { key: "part-time", value: "part-time", label: "Part-time" },
      ],
    };

    return filter;
  };

  return {
    createFilter,
    isLoading: false,
    error: null,
    data: null,
  };
};
