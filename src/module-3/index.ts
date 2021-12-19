import express from "express";
import authRouter from "./controllers/auth";
import groupsRouter from "./controllers/groups";
import userGroupsRouter from "./controllers/user-groups";
import usersRouter from "./controllers/users";
import db from "./data-access";
import { errorsLogger, initHandlers, mainLogger } from "./middlewares/loggers";

const app = express();

initHandlers();

app.use(errorsLogger);

app.listen(3000, () =>
  db
    .authenticate()
    .then(() =>
      console.log(
        "Connection has been established successfully.\nServer started..."
      )
    )
    .then(() => app.use(express.json()))
    .then(() => {
      app.use(mainLogger);
      app.use("/api/auth", authRouter);
      app.use("/api/groups", groupsRouter);
      app.use("/api/users", usersRouter);
      app.use("/api/user-groups", userGroupsRouter);
    })
    .catch((err) => console.error(err))
);
