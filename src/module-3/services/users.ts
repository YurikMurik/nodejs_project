import sequelize from "../data-access";
import User from "../models/user";
import { UserModel } from "../types";
import * as UserGroupsService from "./user-groups";

export const getUsersList = async () =>
  User.findAll({
    where: {
      isDeleted: false
    }
  });

export const getAutoSuggestUsers = async (subsrt?: string, limit = 3) => {
  let users = await getUsersList();

  if (subsrt && limit && users.length) {
    users = users
      .filter((e) => e.getDataValue("login").indexOf(String(subsrt)) !== -1)
      .slice(0, limit)
      .sort((a, b) =>
        a.getDataValue("login").localeCompare(b.getDataValue("login"))
      );
  }

  return users;
};

export const find = async (id: string) =>
  User.findOne({
    where: {
      id,
      isDeleted: false
    }
  });

export const create = async (model: UserModel) => {
  const { login } = model;
  const user = await User.findOne({
    where: {
      login
    }
  });

  if (user) {
    return null;
  }

  return User.create({
    ...model,
    isDeleted: false
  });
};

export const remove = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await find(id);
    if (!user) {
      transaction.rollback();
      return null;
    }

    await UserGroupsService.remove(transaction, {
      userId: id
    });

    await user.update(
      {
        isDeleted: true
      },
      {
        transaction
      }
    );
    await transaction.commit();
  } catch (error) {
    console.error(error);
    transaction.rollback();
  }
};

export const update = async (id: string, model: UserModel) => {
  const user = await find(id);
  const { login, password, age } = model;

  if (!user) {
    return null;
  }

  return user.update({
    login,
    password,
    age
  });
};
