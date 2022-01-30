import express, { Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import { checkToken } from "../middlewares/auth";
import { log, logger } from "../middlewares/loggers";
import * as GroupsService from "../services/groups";
import { Errors, GroupModel } from "../types";
import { createNewUser } from "./users";
import { isNull } from "./utils";
import groupValidationSchema from "./validation/groups";

const validator = createValidator();
const router = express.Router();

export const getGroupsList = async (req: Request, res: Response) => {
  try {
    const groups = await GroupsService.findAll();
    res.status(200).send(groups);
  } catch (e) {
    logger?.setError(e.message);
    res.status(500).send(e.message);
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const group = await GroupsService.find(id);
    if (group) {
      return res.status(200).send(group);
    }
    const err = "Group not found";
    logger?.setError(err);
    res.status(404).send(err);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const createNewGroup = async (req: Request, res: Response) => {
  try {
    const body: GroupModel = req.body;
    const isSuccess = await GroupsService.create(body);
    if (!isSuccess) {
      const err = "Group with this name is already exists";
      logger?.setError(err);
      return res.status(400).send(err);
    }
    res.redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const isSuccess = await GroupsService.remove(id);

    if (isNull(isSuccess)) {
      const err = "Something wrong";
      logger?.setError(err);
      return res.status(404).send(err);
    }
    res.status(200).redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const updateGroup = async (
  { params: { id }, body }: Request,
  res: Response
) => {
  try {
    const status = await GroupsService.update(id, body);
    if ((status as Errors).type === "error") {
      logger?.setError(status);
      return res.status(404).send((status as Errors).message);
    }
    res.status(200).redirect("/api/groups");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

/* Create new group */
router.post(
  "/",
  [
    log(GroupsService.create),
    validator.body(groupValidationSchema),
    checkToken
  ],
  createNewUser
);

/* Delete group */
router.delete("/:id", [checkToken, log(GroupsService.remove)], deleteGroup);

/* Update group */
router.put(
  "/:id",
  [
    log(GroupsService.update),
    checkToken,
    validator.body(groupValidationSchema)
  ],
  updateGroup
);

/* Get all groups */
router.get("/", [checkToken, log(GroupsService.findAll)], getGroupsList);

/* Find group by id */
router.get("/:id", [checkToken, log(GroupsService.find)], getGroupById);

export default router;
