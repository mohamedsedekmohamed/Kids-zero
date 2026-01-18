export const canView = (user, module) => {
  if (!user) return false;

  if (user.type === "organizer") return true;

  return user.permissionsMap?.[module]?.includes("View");
};
