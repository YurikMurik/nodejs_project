import express from "express";
import nodeCache from "node-cache";
import { User } from "./types";
import { isEqualsObjects } from "./utils";

const app = express();
const store = new nodeCache();

app.listen(3000);
app.use(express.json());

app.get("/users", (req, res) => {
  const { id } = req.query;
  const data: User = store.get(String(id));

  if (!id || !data || data.isDeleted === true) {
    res.status(404).send({
      message: `User with id=${id} not found`,
    });
  } else {
    res.send(data);
  }
});

app.post("/users/add", (req, res) => {
  const { id, login, password } = req.body as User;

  if (!id || !login || !password) {
    res.status(400).send({
      message: `Please check sending data: missing parameter(s)`,
    });
  } else if (store.get(id)) {
    res.status(400).send({
      message: `User with id=${id} is already exists`,
    });
  } else {
    store.set(id, req.body);
    res.send({
      message: "success",
    });
  }
});

app.post("/users/edit", (req, res) => {
  const { id } = req.body as User;
  const data: User = store.get(String(id));

  if (!id || !data) {
    res.status(400).send({
      message: `User with id=${id} not found`,
    });
  } else if (isEqualsObjects(req.body, data)) {
    res.status(400).send({
      message: "You try to set the equal data. Please, check your data again.",
    });
  } else {
    const newData = {
      ...data,
      ...req.body,
    };
    store.set(id, newData);
    res.send({
      message: "success",
    });
  }
});

app.get("/users/delete", (req, res) => {
  const { id } = req.query;
  const data: User = store.get(String(id));

  if (!id || !data) {
    res.status(404).send({
      message: `User with id=${id} not found`,
    });
  } else if (data.isDeleted === true) {
    res.status(404).send({
      message: `User with id=${id} is already deleted`,
    });
  } else {
    const newData: User = {
      ...data,
      isDeleted: true,
    };
    store.set(String(id), newData);
    res.send({
      message: "success",
    });
  }
});

app.get("/users/filter", (req, res) => {
  const { login, limit = 2 } = req.query;
  const newData: Array<User> = [];

  if (login === undefined) {
    res.status(404).send({
      message: `Please insert correct login param`,
    });
  } else {
    for (const item in store.data) {
      if (newData.length > limit) {
        break;
      }
      const value = store.data[item].v as User;
      if (value.login.search(String(login))) {
        newData.push(value);
      }
    }

    res.send(newData);
  }
});
