export interface UserInfo {
  beta_user?: boolean;
  campus: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;
  su_admin?: boolean;

  _id?: string;

  perm_level?: PermLevel;
}

export enum PermLevel {
  Member = "member",
  Viewer = "viewer",
  Moderator = "moderator",
  Admin = "admin",
  SuperAdmin = "super_admin",
}
