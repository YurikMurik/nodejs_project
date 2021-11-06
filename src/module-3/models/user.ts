import { DataTypes, Model, ModelCtor } from "sequelize";
import db from "../data-access";
import { UserModel } from "../types";

const User: ModelCtor<Model<UserModel>> = db.define(
  "users",
  {
    login: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.NUMBER
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: false
  }
);

export default User;
