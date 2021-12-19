import { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_DATA, tokenList } from "../data-access";
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
    expiresIn: JWT_DATA.accessTokenExp
  });

  const refreshToken = jwt.sign(payload, JWT_DATA.refreshTokenSecret, {
    expiresIn: JWT_DATA.refreshTokenExp
  });

  const response = {
    token,
    refreshToken
  };

  tokenList[refreshToken] = response;

  return response;
};

export const refreshToken = async (body: Request["body"]) => {
  if (body.refreshToken && body.refreshToken in tokenList) {
    const payload = {
      sub: body.id,
      login: body.login
    };
    const token = jwt.sign(payload, JWT_DATA.accessTokenSecret, {
      expiresIn: JWT_DATA.accessTokenExp
    });

    const response = { token };
    // update the token in the list
    tokenList[body.refreshToken].token = token;

    return response;
  }

  return;
};
