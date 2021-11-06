import { UserModel } from "../types";
import User from "../models/user";

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
  const user = await find(id);

  if (!user) {
    return null;
  }

  return user.update({
    isDeleted: true
  });
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
