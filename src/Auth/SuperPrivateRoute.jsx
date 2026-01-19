import { Navigate } from "react-router-dom";

const SuperPrivateRoute = ({ children, requiredModule, requiredAction }) => {
  const token = localStorage.getItem("token");
  const superAdmin = JSON.parse(localStorage.getItem("superAdmin"));

  if (!token || !superAdmin) return <Navigate to="/loginsuper" replace />;

  // لو organizer مسموح له كل حاجة
  if (superAdmin.role === "superadmin") return children;

  // لو admin: تحقق من permissions
  if (
    requiredModule &&
    requiredAction &&
    !superAdmin.permissionsMap?.[requiredModule]?.includes(requiredAction)
  ) {
    return <Navigate to="/super/unauthorized" replace />;
  }

  return children;
};

export default SuperPrivateRoute;