import { DataTypes, Model, ModelCtor } from "sequelize";
import db from "../data-access";
import { GroupModel } from "../types";

const Group: ModelCtor<Model<GroupModel>> = db.define(
  "groups",
  {
    name: {
      type: DataTypes.STRING
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.CHAR)
    }
  },
  {
    timestamps: false
  }
);

export default Group;
