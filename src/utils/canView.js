export const canView = (user, module) => {
  if (!user) return false;

  if (user.type === "organizer") return true;

  if (user.role === "superadmin") return true;

  if (user.role === "subadmin" || user.type === "admin") {
    return (
      user.permissionsMap?.[module]?.includes("view") ||
      user.permissionsMap?.[module]?.includes("View")
    );
  }

  return false;
};