import { UserGroupModel } from "../types";

export type AddUsersToGroupModel = Omit<UserGroupModel, "userId"> & {
  userIds: Array<UserGroupModel["userId"]>;
};
