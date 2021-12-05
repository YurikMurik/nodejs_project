import express from "express";
import morgan from "morgan";
import groupsRouter from "./controllers/groups";
import userGroupsRouter from "./controllers/user-groups";
import usersRouter from "./controllers/users";
import db from "./data-access";
import { LoggerStream } from "./logger";

const app = express();

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

// app.use(morgan("INFO: :something"));
app.use(morgan("combined", { stream: new LoggerStream() }));

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
