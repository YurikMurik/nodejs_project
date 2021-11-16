import sequelize from "../data-access";
import UserGroup from "../models/user-group";
import { UserGroupModel } from "../types";
import { find as findGroupById } from "./groups";
import { find as findUserById } from "./users";

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
  const group = findGroupById(groupId);

  try {
    userIds?.forEach(async (id) => {
      const user = findUserById(id);

      if (!user || !group) {
        return undefined;
      }

      UserGroup.create(
        {
          userId: id,
          groupId
        },
        { transaction }
      );

      console.log("success");
    });
    transaction.afterCommit(() => {
      // return Promise.resolve();
    });
  } catch (error) {
    console.log("error");
    await transaction.rollback();
  }
};

// export const remove = async (id: string) => {
//   const group = await find(id);

//   if (!group) {
//     return null;
//   }

//   group.destroy();
// };
