import { BaseUser, GroupModel, UserGroupModel } from "../types";

export type AddUsersToGroupModel = Omit<UserGroupModel, "userId"> & {
  userIds: Array<UserGroupModel["userId"]>;
};

export interface RemoveUserGroupParams {
  userId?: BaseUser["id"];
  groupId?: GroupModel["id"];
}
