import express, { Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import { log, logger } from "../middlewares/loggers";
import * as AuthService from "../services/auth";
import { UserAuthModel } from "../types";
import authValidationSchema from "./validation/auth";

const validator = createValidator();
const router = express.Router();

router.post(
  "/",
  [validator.body(authValidationSchema), log(AuthService.verify)],
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
      logger.setError(e);
      res.status(500).send(e.message);
    }
  }
);

export default router;
