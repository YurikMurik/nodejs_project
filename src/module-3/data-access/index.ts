import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

if (!process.env.DB_URL) {
  process.exit(1);
}

const DB_URL = process.env.DB_URL;

export const JWT_DATA = {
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenExp: process.env.JWT_REFRESH_TOKEN_EXP,
  accessTokenExp: process.env.JWT_ACCESS_TOKEN_EXP
};

export default new Sequelize(DB_URL, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
