/**
 * Статический фильтр для типов пользователей
 * Показывается только когда выбрана роль "user"
 */
export const useUserTypeFilter = () => {
  return {
    createFilter: (currentFilters) => {
      return {
        key: "user_types",
        label: "User Type",
        options: [
          { key: "student", label: "Student", value: "student" },
          { key: "professor", label: "Professor", value: "professor" },
        ],
        showWhen: { key: "user_roles", value: "user" },
      };
    },
    isLoading: false,
    error: null,
    data: null,
  };
};
