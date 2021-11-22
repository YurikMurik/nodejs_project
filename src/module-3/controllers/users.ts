import express from "express";
import { createValidator } from "express-joi-validation";
import { UserModel } from "../types";
import * as UsersService from "../services/users";
import { isNull } from "./utils";
import userValidationSchema from "./validation/users";

const validator = createValidator();
const router = express.Router();

/* Get users list */

router.get("/", async (req, res) => {
  try {
    const users = await UsersService.getAutoSuggestUsers(
      req.body.loginSubstring,
      req.body.limit
    );
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Find user by id */

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UsersService.find(id);
    if (user) {
      return res.status(200).send(user);
    }
    res.status(404).send("User not found");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Create user */

router.post("/", validator.body(userValidationSchema), async (req, res) => {
  try {
    const body: UserModel = req.body;
    const isSuccess = await UsersService.create(body);
    if (!isSuccess) {
      return res.status(400).send("User with this login is already exists");
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Delete user */

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isSuccess = await UsersService.remove(id);
    if (isNull(isSuccess)) {
      return res.status(404).send("User with this id is not found");
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update user */

router.put("/:id", validator.body(userValidationSchema), async (req, res) => {
  try {
    const id = req.params.id;
    const isSuccess = await UsersService.update(id, req.body);
    if (!isSuccess) {
      return res.status(404).send("User with this id is not found");
    }
    res.redirect("/api/users");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
