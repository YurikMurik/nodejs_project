import * as dotenv from "dotenv";
import express from "express";
import { Sequelize } from "sequelize";

// class User extends Model {}

dotenv.config();

const app = express();

app.use(express.json());
// app.use("/api/users", usersRouter);

/* TODO: need to move in separated files */
const DB_URL = process.env.DB_URL;

const sequelize = new Sequelize(DB_URL);

app.listen(3000, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
