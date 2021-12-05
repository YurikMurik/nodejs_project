import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { EventEmitter } from "stream";
import groupsRouter from "./controllers/groups";
import userGroupsRouter from "./controllers/user-groups";
import usersRouter from "./controllers/users";
import db from "./data-access";

const app = express();

const cache = [];
export const emitter = new EventEmitter();
emitter.addListener("addFn", (args: string) => {
  cache.push(args);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const logFuncion = (fnName: string, args: any[]) => {
//   return `function name: ${fnName}, args: ${args.toString()}`;
// };

const middleware = (req: Request, res: Response, next: NextFunction) => {
  res.once("finish", () => {
    console.log(cache);
  });
  next();
};

morgan.token("something", (req, res, rand) => {
  //   console.log({ chunk });
  // });
  // console.log(req.method);
  return req.headers.tk;
});

app.use(morgan("INFO: :something"));

// app.use(middleware);

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
      app.use(middleware);
      app.use("/api/groups", groupsRouter);
      app.use("/api/users", usersRouter);
      app.use("/api/user-groups", userGroupsRouter);
    })
    .catch((err) => console.error(err))
);
