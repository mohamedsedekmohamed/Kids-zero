export const can = (user, module, action) => {
  if (!user) return false;

  if (user.type === "organizer") return true;

  if (user.role === "superadmin") return true;

  if (user.role === "subadmin" || user.type === "admin") {
    return user.permissionsMap?.[module]?.includes(action);
  }
  return false; 
};