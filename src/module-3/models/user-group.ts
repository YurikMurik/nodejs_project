import { DataTypes, Model, ModelCtor } from "sequelize";
import db from "../data-access";
import { UserGroupModel } from "../types";

const UserGroup: ModelCtor<Model<UserGroupModel>> = db.define(
  "user-groups",
  {
    id: {
      type: DataTypes.NUMBER
    },
    role: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false
  }
);

export default UserGroup;
