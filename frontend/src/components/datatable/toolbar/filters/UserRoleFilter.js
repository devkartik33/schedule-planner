/**
 * Статический фильтр для ролей пользователей
 */
export const useUserRoleFilter = () => {
  return {
    createFilter: (currentFilters) => {
      return {
        key: "user_roles",
        label: "Role",
        options: [
          { key: "admin", label: "Admin", value: "admin" },
          { key: "coordinator", label: "Coordinator", value: "coordinator" },
          { key: "user", label: "User", value: "user" },
        ],
      };
    },
    isLoading: false,
    error: null,
    data: null,
  };
};
