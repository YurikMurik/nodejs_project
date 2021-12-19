import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_DATA } from "../data-access";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    return res
      .status(403)
      .send({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_DATA.accessTokenSecret, (err: Error, decoded) => {
    if (err) {
      return res.json({ success: false, message: "Failed to auth token." });
    }

    next();
  });
};
