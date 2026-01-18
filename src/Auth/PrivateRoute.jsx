import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredModule, requiredAction }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" replace />;

  // لو organizer مسموح له كل حاجة
  if (user.type === "organizer") return children;

  // لو admin: تحقق من permissions
  if (
    requiredModule &&
    requiredAction &&
    !user.permissionsMap?.[requiredModule]?.includes(requiredAction)
  ) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;