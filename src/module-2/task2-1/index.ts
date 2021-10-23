import express from "express";
import { getStoreData, setDataToStore, store } from "./store";
import { User, UserRequest } from "./types";
import { isEqualsObjects } from "./utils";

const app = express();

app.listen(3000);
app.use(express.json());

app.get("/users", (req, res) => {
  const { id } = req.query;
  const data: User = getStoreData(id as string);

  if (!id || !data || data.isDeleted === true) {
    res.status(404).send({
      message: `User with id=${id} not found`,
    });
  } else {
    res.send(data);
  }
});

app.post("/users/add", (req, res) => {
  const { login, password } = req.body as UserRequest;

  if (!login || !password) {
    res.status(400).send({
      message: `Please check sending data: missing parameter(s)`,
    });
  } else if (store.find((e) => e.login === login)) {
    res.status(400).send({
      message: `User with login=${login} is already exists`,
    });
  } else {
    setDataToStore(req.body);
    res.send({
      message: "success",
    });
  }
});

app.post("/users/edit", (req, res) => {
  const { id } = req.body;
  const data: User = getStoreData(id);

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
    setDataToStore(newData);
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
