import express from "express";
import { createValidator } from "express-joi-validation";
import { AddUsersToGroupModel } from "../services/types";
import * as UserGroupsService from "../services/user-groups";
import userGroupValidationSchema from "./validation/user-groups";

const validator = createValidator();
const router = express.Router();

/* Get user-groups list */

router.get("/", async (req, res) => {
  try {
    const userGroups = await UserGroupsService.findAll();
    res.status(200).send(userGroups);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Add user to any group by id*/

router.post(
  "/",
  validator.body(userGroupValidationSchema),
  async (req, res) => {
    try {
      const body: AddUsersToGroupModel = req.body;
      await UserGroupsService.addUsersToGroup(body.groupId, body.userIds);
      res.redirect("/api/user-groups");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

export default router;
