import express from "express";
import { createValidator } from "express-joi-validation";
import { log, logger } from "../loggers";
import * as GroupsService from "../services/groups";
import { Errors, GroupModel } from "../types";
import { isNull } from "./utils";
import groupValidationSchema from "./validation/groups";

const validator = createValidator();
const router = express.Router();

/* Get all groups */

router.get("/", log(GroupsService.findAll), async (req, res) => {
  try {
    const groups = await GroupsService.findAll();
    res.status(200).send(groups);
  } catch (e) {
    logger.setError(e.message);
    res.status(500).send(e.message);
  }
});

/* Find group by id */

router.get("/:id", log(GroupsService.find), async (req, res) => {
  try {
    const id = req.params.id;
    const group = await GroupsService.find(id);
    if (group) {
      return res.status(200).send(group);
    }
    const err = "Group not found";
    logger.setError(err);
    res.status(404).send(err);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Create new group */

router.post(
  "/",
  [log(GroupsService.create), validator.body(groupValidationSchema)],
  async (req, res) => {
    try {
      const body: GroupModel = req.body;
      const isSuccess = await GroupsService.create(body);
      if (!isSuccess) {
        const err = "Group with this name is already exists";
        logger.setError(err);
        return res.status(400).send(err);
      }
      res.redirect("/api/groups");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

/* Delete group */

router.delete("/:id", log(GroupsService.remove), async (req, res) => {
  try {
    const id = req.params.id;
    const isSuccess = await GroupsService.remove(id);
    if (isNull(isSuccess)) {
      const err = "Something wrong";
      logger.setError(err);
      return res.status(404).send(err);
    }
    res.redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update group */

router.put(
  "/:id",
  [log(GroupsService.update), validator.body(groupValidationSchema)],
  async ({ params: { id }, body }, res) => {
    try {
      const status = await GroupsService.update(id, body);
      if ((status as Errors).type === "error") {
        logger.setError(status);
        return res.status(404).send((status as Errors).message);
      }
      res.redirect("/api/groups");
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);

export default router;
