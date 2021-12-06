import express from "express";
import groupsRouter from "./controllers/groups";
import userGroupsRouter from "./controllers/user-groups";
import usersRouter from "./controllers/users";
import db from "./data-access";
import {
  errorLoggerMiddleware,
  initHandlers,
  mainLoggerMiddleware
} from "./loggers";

const app = express();

initHandlers();

app.use(errorLoggerMiddleware);

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
      app.use(mainLoggerMiddleware);
      app.use("/api/groups", groupsRouter);
      app.use("/api/users", usersRouter);
      app.use("/api/user-groups", userGroupsRouter);
    })
    .catch((err) => console.error(err))
);
