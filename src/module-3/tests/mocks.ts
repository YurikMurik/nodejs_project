import { UserModel } from "../types";

export const mockedUserData: Record<"dataValues", UserModel> = {
  dataValues: {
    id: "9999",
    login: "mocked-data",
    password: "mocked-pass",
    age: 25,
    isDeleted: false
  }
};

export const mockedUsersData: Record<"dataValues", UserModel>[] = [
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "1",
      login: "first-mocked-data"
    }
  },
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "2",
      login: "second-mocked-data"
    }
  },
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "3",
      login: "third-mocked-data"
    }
  },
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "4",
      login: "fourth-mocked-data"
    }
  },
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "5",
      login: "fifth-mocked-data"
    }
  },
  {
    dataValues: {
      ...mockedUserData.dataValues,
      id: "5",
      login: "first-1-mocked-data"
    }
  }
];

export const emptyUserData = null;
