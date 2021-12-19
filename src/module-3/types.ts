export interface BaseUser {
  id?: string;
  isDeleted?: boolean;
}

export interface BaseGroup {
  id?: string;
}
export interface UserModel extends BaseUser {
  login: string;
  password: string;
  age: number;
}

export type UserAuthModel = Pick<UserModel, "login" | "password">;

export type Permissions =
  | "READ"
  | "WRITE"
  | "DELETE"
  | "SHARE"
  | "UPLOAD_FILES";

export interface GroupModel extends BaseGroup {
  name: string;
  permissions: Array<Permissions>;
}

export interface Errors {
  type: string;
  message: string;
}

export interface UserGroupModel {
  userId: string;
  groupId: string;
}
