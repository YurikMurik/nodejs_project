import express from "express";
import { editDataStore, getStoreData, setDataToStore } from "./store";
import { User, UserRequest } from "./types";
import {
  getAutoSuggestUsers,
  isAlreadyExistsItem,
  isEqualsObjects
} from "./utils";
import { validate } from "./validation";

const app = express();

app.listen(3000);
app.use(express.json());

app.get("/users", (req, res) => {
  const { id } = req.query;
  const data: User = getStoreData(String(id));

  if (!data || data.isDeleted === true) {
    return res.status(404).send({
      message: `User with id=${id} not found`
    });
  }

  res.send(data);
});

app.post("/users/add", (req, res) => {
  const { login } = req.body as UserRequest;
  const isNotValid = validate(req.body);

  if (isNotValid) {
    return res.status(400).send({
      message: isNotValid.details[0].message
    });
  }

  if (isAlreadyExistsItem(login)) {
    return res.status(400).send({
      message: `User with login=${login} is already exists`
    });
  }

  setDataToStore(req.body);
  res.send({
    message: "success"
  });
});

app.post("/users/edit", (req, res) => {
  const { id } = req.query;
  const isNotValid = validate(req.body);

  if (isNotValid) {
    return res.status(400).send({
      message: isNotValid.details[0].message
    });
  }

  const data: User = getStoreData(String(id));

  if (!data) {
    return res.status(404).send({
      message: `User with id=${id} not found`
    });
  }

  if (isEqualsObjects(req.body, data)) {
    return res.status(400).send({
      message: "You try to set the equal data. Please, check your data again."
    });
  }

  const newData = {
    ...data,
    ...req.body,
    id: data.id
  };

  editDataStore(newData);
  res.send({
    message: "success"
  });
});

app.get("/users/delete", (req, res) => {
  const { id } = req.query;
  const data: User = getStoreData(String(id));

  if (!data) {
    return res.status(404).send({
      message: `User with id=${id} not found`
    });
  }

  if (data.isDeleted === true) {
    return res.status(404).send({
      message: `User with id=${id} is already deleted`
    });
  }

  const newData: User = {
    ...data,
    isDeleted: true
  };

  editDataStore(newData);

  res.send({
    message: "success"
  });
});

app.get("/users/filter", (req, res) => {
  const { login, limit = 2 } = req.query;

  if (login === undefined) {
    return res.status(404).send({
      message: "Please insert correct login param"
    });
  }

  const data = getAutoSuggestUsers(String(login), Number(limit));

  res.send(data);
});
