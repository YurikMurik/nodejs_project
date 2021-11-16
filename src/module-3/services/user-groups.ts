import { Transaction } from "sequelize/types";
import sequelize from "../data-access";
import UserGroup from "../models/user-group";
import { UserGroupModel } from "../types";
import { find as findGroupById } from "./groups";
import { RemoveUserGroupParams } from "./types";
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

export const remove = async (
  transaction: Transaction,
  params: RemoveUserGroupParams
) => {
  const { userId, groupId } = params ?? {};
  const id = userId ?? groupId;

  if (!id) {
    return Promise.reject();
  }

  const userGroups = await UserGroup.findAll({
    where: {
      ...(userId ? { userId: id } : undefined),
      ...(groupId ? { groupId: id } : undefined)
    }
  });

  if (!userGroups.length) {
    return Promise.reject();
  }

  for (const userGroup of userGroups) {
    await userGroup.destroy({ transaction });
  }

  return Promise.resolve();
};
