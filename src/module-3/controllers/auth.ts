import express, { Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import { log, logger } from "../middlewares/loggers";
import * as AuthService from "../services/auth";
import { UserAuthModel } from "../types";
import {
  loginValidationSchema,
  updTokenValidationSchema
} from "./validation/auth";

const validator = createValidator();
const router = express.Router();

router.post(
  "/login",
  [validator.body(loginValidationSchema), log(AuthService.verify)],
  async (req: Request, res: Response) => {
    try {
      const { login, password }: UserAuthModel = req.body;
      const token = (await AuthService.verify(login, password)) ?? {};

      if (!token) {
        return res.status(403).send({
          success: false,
          message: "Bad username / password combination. Please try again."
        });
      }

      res.status(200).send(token);
    } catch (e) {
      logger?.setError(e);
      res.status(500).send(e.message);
    }
  }
);

router.post(
  "/token",
  [validator.body(updTokenValidationSchema), log(AuthService.refreshToken)],
  async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const token = await AuthService.refreshToken(data);
      if (!token) {
        return res.status(404).send("Invalid request");
      }
      res.status(200).json(token);
    } catch (e) {
      logger?.setError(e);
    }
  }
);

export default router;
