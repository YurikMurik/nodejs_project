import express from "express";
import groupsRouter from "./controllers/groups";
import userGroupsRouter from "./controllers/user-groups";
import usersRouter from "./controllers/users";
import db from "./data-access";
import { LoggerStore } from "./logger";

const app = express();

export const logger = new LoggerStore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const logFuncion = (fnName: string, args: any[]) => {
//   return `function name: ${fnName}, args: ${args.toString()}`;
// };

// morgan.token("something", (req, res, rand) => {
//   //   console.log({ chunk });
//   // });
//   // console.log(req.method);
//   return req.headers.tk;
// });

// TODO: stay here
app.use(logger.getFnData);

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
      app.use("/api/groups", groupsRouter);
      app.use("/api/users", usersRouter);
      app.use("/api/user-groups", userGroupsRouter);
    })
    .catch((err) => console.error(err))
);
