import express from "express";
import { createValidator } from "express-joi-validation";
import { checkToken } from "../middlewares/auth";
import { log, logger } from "../middlewares/loggers";
import { AddUsersToGroupModel } from "../services/types";
import * as UserGroupsService from "../services/user-groups";
import userGroupValidationSchema from "./validation/user-groups";

const validator = createValidator();
const router = express.Router();

/* Get user-groups list */

router.get(
  "/",
  [checkToken, log(UserGroupsService.findAll)],
  async (req, res) => {
    try {
      const userGroups = await UserGroupsService.findAll();
      res.status(200).send(userGroups);
    } catch (e) {
      logger?.setError(e);
      res.status(500).send(e.message);
    }
  }
);

/* Add user to any group by id*/

router.post(
  "/",
  [
    log(UserGroupsService.addUsersToGroup),
    validator.body(userGroupValidationSchema),
    checkToken
  ],
  async (req, res) => {
    try {
      const { groupId, userIds }: AddUsersToGroupModel = req.body;
      await UserGroupsService.addUsersToGroup(groupId, userIds);
      res.redirect("/api/user-groups");
    } catch (e) {
      logger?.setError(e);
      res.status(500).send(e.message);
    }
  }
);

export default router;
