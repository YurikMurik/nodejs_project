import express from "express";
import { createValidator } from "express-joi-validation";
import * as GroupsService from "../services/groups";
import { Errors, GroupModel } from "../types";
import { isNull } from "./utils";
import groupValidationSchema from "./validation/groups";

const validator = createValidator();
const router = express.Router();

/* Get all groups */

router.get("/", async (req, res) => {
  try {
    const groups = await GroupsService.findAll();
    res.status(200).send(groups);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Find group by id */

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await GroupsService.find(id);
    if (group) {
      return res.status(200).send(group);
    }
    res.status(404).send("Group not found");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Create new group */

router.post("/", validator.body(groupValidationSchema), async (req, res) => {
  try {
    const body: GroupModel = req.body;
    const isSuccess = await GroupsService.create(body);
    if (!isSuccess) {
      return res.status(400).send("Group with this name is already exists");
    }
    res.redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Delete group */

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isSuccess = await GroupsService.remove(id);
    if (isNull(isSuccess)) {
      return res.status(404).send("Something wrong");
    }
    res.redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update group */

router.put("/:id", validator.body(groupValidationSchema), async (req, res) => {
  try {
    const id = req.params.id;
    const status = await GroupsService.update(id, req.body);
    if ((status as Errors).type === "error") {
      return res.status(404).send((status as Errors).message);
    }
    res.redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
