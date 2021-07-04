import { PermLevel, UserInfo } from "../interfaces/UserInfo";

// Quick obj to map permission levels to their authorised access levels
// Can probably be optimised but this works for now
const permissionsMap = {
  [PermLevel.SuperAdmin]: [
    PermLevel.SuperAdmin,
    PermLevel.Admin,
    PermLevel.Moderator,
    PermLevel.Member,
    PermLevel.Viewer,
  ],
  [PermLevel.Admin]: [
    PermLevel.Admin,
    PermLevel.Moderator,
    PermLevel.Member,
    PermLevel.Viewer,
  ],
  [PermLevel.Moderator]: [
    PermLevel.Moderator,
    PermLevel.Member,
    PermLevel.Viewer,
  ],
  [PermLevel.Member]: [PermLevel.Member, PermLevel.Viewer],
  [PermLevel.Viewer]: [PermLevel.Viewer],
};

export function HasPermissionLevel(
  user: UserInfo | undefined,
  level: PermLevel
): boolean {
  return (
    user !== undefined &&
    user.perm_level !== undefined &&
    permissionsMap[user.perm_level].includes(level)
  );
}
