import { Model } from "sequelize/types";
import sequelize from "../data-access";
import Group from "../models/group";
import { Errors, GroupModel } from "../types";
import * as UserGroupsService from "./user-groups";
import { isEqualsObjects } from "./utils";

export const find = async (id: string) =>
  Group.findOne({
    where: {
      id
    }
  });

export const findAll = async () =>
  Group.findAll({
    raw: true
  });

export const create = async (model: GroupModel) => {
  const { name } = model;
  const group = await Group.findOne({
    where: {
      name
    }
  });

  if (group) {
    return null;
  }

  return Group.create({
    ...model
  });
};

export const remove = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const group = await find(id);

    if (!group) {
      transaction.rollback();
      return null;
    }

    await UserGroupsService.remove(transaction, {
      groupId: id
    });

    await group.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    console.error(error);
    transaction.rollback();
  }
};

export const update = async (
  id: string,
  model: GroupModel
): Promise<Model<GroupModel, GroupModel> | Errors> => {
  const group = await find(id);
  const { name, permissions } = model;

  if (!group) {
    return {
      type: "error",
      message: "Group with this id not found"
    };
  }

  if (isEqualsObjects(group.get(), model)) {
    return {
      type: "error",
      message: "Input data is equal with exist data. Forbidden"
    };
  }

  return group.update({
    name,
    permissions
  });
};
