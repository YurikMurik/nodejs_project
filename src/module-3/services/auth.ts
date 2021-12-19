import jwt from "jsonwebtoken";
import { JWT_DATA } from "../data-access";
import User from "../models/user";
import { UserModel } from "../types";

export const verify = async (
  login: UserModel["login"],
  password: UserModel["password"]
) => {
  const user = await User.findOne({
    where: {
      login,
      password,
      isDeleted: false
    }
  });

  if (!user) {
    return;
  }

  const payload = {
    sub: user.get("id"),
    login: user.get("login")
  };

  const token = jwt.sign(payload, JWT_DATA.accessTokenSecret, {
    expiresIn: Number(JWT_DATA.accessTokenExp)
  });

  return {
    token
  };
};
