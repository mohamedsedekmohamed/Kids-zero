export const can = (user, module, action) => {
  if (user.type === "organizer") return true;

  if (user.type !== "admin") return false;

  return user.permissionsMap?.[module]?.includes(action);
};
