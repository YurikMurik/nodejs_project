import express from "express";
import { createValidator } from "express-joi-validation";
import { AddUsersToGroupModel } from "../services/types";
import * as UserGroupsService from "../services/user-groups";
import userGroupValidationSchema from "./validation/user-groups";

const validator = createValidator();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userGroups = await UserGroupsService.findAll();
    res.status(200).send(userGroups);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post(
  "/",
  validator.body(userGroupValidationSchema),
  async (req, res) => {
    try {
      const body: AddUsersToGroupModel = req.body;
      await UserGroupsService.addUsersToGroup(body.groupId, body.userIds);
      // const isSuccess = await GroupsService.create(body);
      // if (!isSuccess) {
      //   return res.status(400).send("Group with this name is already exists");
      // }
      res.redirect("/api/user-groups");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

router.delete("/:id", async (req, res) => {
  // try {
  //   const id = req.params.id;
  //   const isSuccess = await GroupsService.remove(id);
  //   if (isNull(isSuccess)) {
  //     return res.status(404).send("Group with this name is not found");
  //   }
  //   res.redirect("/api/groups");
  // } catch (e) {
  //   res.status(500).send(e.message);
  // }
});

export default router;
