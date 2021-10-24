import express from "express";
import { editDataStore, getStoreData, setDataToStore } from "./store";
import { User, UserRequest } from "./types";
import { getAutoSuggestUsers, isAlreadyExistsItem } from "./utils";

const app = express();

app.listen(3000);
app.use(express.json());

app.get("/users", (req, res) => {
  const { id } = req.query;
  const data: User = getStoreData(id as string);

  if (!id || !data || data.isDeleted === true) {
    return res.status(404).send({
      message: `User with id=${id} not found`,
    });
  }

  res.send(data);
});

app.post("/users/add", (req, res) => {
  const { login, password } = req.body as UserRequest;

  if (!login || !password) {
    return res.status(400).send({
      message: `Please check sending data: missing parameter(s)`,
    });
  }

  if (isAlreadyExistsItem(login)) {
    return res.status(400).send({
      message: `User with login=${login} is already exists`,
    });
  }

  setDataToStore(req.body);
  res.send({
    message: "success",
  });
});

app.post("/users/edit", (req, res) => {
  const { id } = req.query;
  const { login } = req.body as UserRequest;

  const data: User = getStoreData(String(id));

  if (!id || !data) {
    return res.status(404).send({
      message: `User with id=${id} not found`,
    });
  }

  if (isAlreadyExistsItem(login)) {
    return res.status(400).send({
      message: `User with login=${login} is already exists`,
    });
  }

  const newData = {
    ...data,
    ...req.body,
    id: data.id,
  };

  editDataStore(newData);
  res.send({
    message: "success",
  });
});

app.get("/users/delete", (req, res) => {
  const { id } = req.query;
  const data: User = getStoreData(String(id));

  if (!id || !data) {
    return res.status(404).send({
      message: `User with id=${id} not found`,
    });
  }

  if (data.isDeleted === true) {
    return res.status(404).send({
      message: `User with id=${id} is already deleted`,
    });
  }

  const newData: User = {
    ...data,
    isDeleted: true,
  };

  editDataStore(newData);

  res.send({
    message: "success",
  });
});

app.get("/users/filter", (req, res) => {
  const { login, limit = 2 } = req.query;

  if (login === undefined) {
    return res.status(404).send({
      message: `Please insert correct login param`,
    });
  }

  const data = getAutoSuggestUsers(String(login), Number(limit));

  res.send(data);
});
