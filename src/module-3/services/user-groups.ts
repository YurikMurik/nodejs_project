import sequelize from "../data-access";
import UserGroup from "../models/user-group";
import { UserGroupModel } from "../types";
import { find as findGroupById } from "./groups";
import { find as findUserById } from "./users";

export const findAll = async () => UserGroup.findAll();

export const findUserGroup = async (userId: string) =>
  UserGroup.findOne({
    where: {
      userId
    }
  });

export const addUsersToGroup = async (
  groupId: UserGroupModel["groupId"],
  userIds: Array<UserGroupModel["userId"]>
) => {
  const group = findGroupById(groupId);
  const transaction = await sequelize.transaction();

  try {
    return sequelize
      .transaction(async (t) => {
        for (const userId of userIds) {
          const user = await findUserById(userId);
          const isUserGroupExisted = await UserGroup.findOne({
            where: {
              groupId,
              userId
            }
          });

          if (!user || !group || isUserGroupExisted) {
            return;
          }

          await UserGroup.create(
            {
              userId,
              groupId
            },
            { transaction: t }
          );
        }
      })
      .then(() => {
        return Promise.resolve();
      });
  } catch (error) {
    console.error(error);
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
