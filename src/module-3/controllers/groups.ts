import express from "express";
import { createValidator } from "express-joi-validation";
import { logger } from "../loggers";
import * as GroupsService from "../services/groups";
import { Errors, GroupModel } from "../types";
import { isNull } from "./utils";
import groupValidationSchema from "./validation/groups";

const validator = createValidator();
const router = express.Router();

/* Get all groups */

router.get(
  "/",
  (req, res, next) => {
    logger.setFnData(GroupsService.findAll.name);
    next();
  },
  async (req, res) => {
    try {
      const groups = await GroupsService.findAll();
      res.status(200).send(groups);
    } catch (e) {
      logger.setError(e.message);
      res.status(500).send(e.message);
    }
  }
);

/* Find group by id */

router.get(
  "/:id",
  (req, res, next) => {
    logger.setFnData(GroupsService.find.name, { id: req.params.id });
    next();
  },
  async (req, res) => {
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
  }
);

/* Create new group */

router.post(
  "/",
  (req, res, next) => {
    logger.setFnData(GroupsService.create.name, { body: req.body });
    next();
  },
  validator.body(groupValidationSchema),
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

router.delete(
  "/:id",
  (req, res, next) => {
    logger.setFnData(GroupsService.remove.name, { id: req.params.id });
    next();
  },
  async (req, res) => {
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
  }
);

/* Update group */

router.put(
  "/:id",
  [
    (req, res, next) => {
      logger.setFnData(GroupsService.update.name, {
        id: req.params.id,
        body: req.body
      });
      next();
    },
    validator.body(groupValidationSchema)
  ],
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
