import express from "express";
import { createValidator } from "express-joi-validation";
import { log, logger } from "../loggers";
import * as UsersService from "../services/users";
import { UserModel } from "../types";
import { isNull } from "./utils";
import userValidationSchema from "./validation/users";

const validator = createValidator();
const router = express.Router();

/* Get users list */

router.get(
  "/",
  log(UsersService.getAutoSuggestUsers),
  async ({ body }, res) => {
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
  }
);

/* Find user by id */

router.get("/:id", log(UsersService.find), async (req, res) => {
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
});

/* Create user */

router.post(
  "/",
  [log(UsersService.create), validator.body(userValidationSchema)],
  async (req, res) => {
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
  }
);

/* Delete user */

router.delete("/:id", log(UsersService.remove), async (req, res) => {
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
});

/* Update user */

router.put(
  "/:id",
  [log(UsersService.update), validator.body(userValidationSchema)],
  async (req, res) => {
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
  }
);

export default router;
