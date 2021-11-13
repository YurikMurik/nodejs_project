import sequelize from "../data-access";
import UserGroup from "../models/user-group";
import { UserGroupModel } from "../types";

export const getUserGroup = async (userId: string) =>
  UserGroup.findOne({
    where: {
      userId
    }
  });

export const addUsersToGroup = async (
  groupId: UserGroupModel["groupId"],
  userIds: Array<UserGroupModel["userId"]>
) => {
  const transaction = await sequelize.transaction();

  // TODO: continue here...
};

// export const remove = async (id: string) => {
//   const group = await find(id);

//   if (!group) {
//     return null;
//   }

//   group.destroy();
// };
