import express from "express";
import usersRouter from "./controllers/users";
import db from "./data-access";

const app = express();

app.listen(3000, () =>
  db
    .authenticate()
    .then(() =>
      console.log(
        "Connection has been established successfully.\nServer started..."
      )
    )
    .then(() => app.use(express.json()))
    .then(() => app.use("/api/users", usersRouter))
    .catch((err) => console.error(err))
);
