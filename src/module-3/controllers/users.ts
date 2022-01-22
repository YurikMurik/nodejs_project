import express, { Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import { checkToken } from "../middlewares/auth";
import { log, logger } from "../middlewares/loggers";
import * as UsersService from "../services/users";
import { UserModel } from "../types";
import { isNull } from "./utils";
import userValidationSchema from "./validation/users";

const validator = createValidator();
const router = express.Router();

export const getUsersList = async ({ body }: Request, res: Response) => {
  try {
    const users = await UsersService.getAutoSuggestUsers(
      body.loginSubstring,
      body.limit
    );
    res.status(200).send(users);
  } catch (e) {
    logger.setError(e);
    res.status(500).send(e.message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UsersService.find(id);
    if (user) {
      return res.status(200).send(user);
    }
    const err = "User not found";
    logger.setError(err);
    res.status(404).send(err);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const body: UserModel = req.body;
    const isSuccess = await UsersService.create(body);
    if (!isSuccess) {
      const err = "User with this login is already exists";
      logger.setError(err);
      return res.status(400).send(err);
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isSuccess = await UsersService.remove(id);
    if (isNull(isSuccess)) {
      const err = "User with this id is not found";
      logger.setError(err);
      return res.status(404).send(err);
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isSuccess = await UsersService.update(id, req.body);
    if (!isSuccess) {
      const err = "User with this id is not found";
      logger.setError(err);
      return res.status(404).send(err);
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

/* Get users list */
router.get("/", checkToken, getUsersList);

/* Get user by id */
router.get("/:id", [checkToken, log(UsersService.find)], getUserById);

/* Create new user */
router.post(
  "/",
  [log(UsersService.create), checkToken, validator.body(userValidationSchema)],
  createNewUser
);

/* Delete user */
router.delete("/:id", [checkToken, log(UsersService.remove)], deleteUserById);

/* Update user */
router.put(
  "/:id",
  [log(UsersService.update), checkToken, validator.body(userValidationSchema)],
  updateUserInfo
);

export default router;
