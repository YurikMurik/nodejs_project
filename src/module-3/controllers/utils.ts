import { Model } from "sequelize/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNull = (value: Model<any, any>) => value === null;
