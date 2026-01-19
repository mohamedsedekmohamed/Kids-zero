import { Navigate } from "react-router-dom";

const SuperSaveRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  if (!token || role !== "super") {
    return <Navigate to="/loginsuper" replace />;
  }

  return children;
};

export default SuperSaveRoute;