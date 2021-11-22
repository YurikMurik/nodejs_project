import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

if (!process.env.DB_URL) {
  process.exit(1);
}

const DB_URL = process.env.DB_URL;

export default new Sequelize(DB_URL);
