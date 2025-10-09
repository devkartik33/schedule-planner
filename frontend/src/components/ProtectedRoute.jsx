import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function ProtectedRoute({
  children,
  requiredRoles = ["admin", "coordinator"],
}) {
  const { user } = useAuth();

  if (user === null) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Проверяем, есть ли роль пользователя в списке разрешенных ролей
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
