import { getMockReq, getMockRes } from "@jest-mock/express";
import sinon from "sinon";
import {
  createNewUser,
  deleteUserById,
  getUserById,
  getUsersList,
  updateUserInfo
} from "../../controllers/users";
import sequelize from "../../data-access/";
// import * as UsersService from "../../services/users";
import User from "../../models/user";
import * as UserGroupsService from "../../services/user-groups";
import { UserModel } from "../../types";
import { areEqualsObjects } from "../../utils";
import { mockedUsersData } from "../mocks";

type MockedData = Record<"dataValues", UserModel>[];

describe("check users controller's methods", () => {
  const mockedReq = getMockReq();
  const mockedRes = getMockRes();

  const stubs = {
    callFindAll: () =>
      sinon.stub(User, "findAll").resolves(mockedUsersData as any),
    callUserUpdate: (mockedData: MockedData) =>
      sinon.stub(User, "update").callsFake((params, { where }) => {
        const elemIndex = mockedData.findIndex(
          (e) => e.dataValues.id === (where as any).id
        );

        if (!elemIndex && elemIndex !== 0) {
          return;
        }

        const data = {
          dataValues: {
            ...mockedData[elemIndex].dataValues,
            ...params
          }
        };

        delete mockedData[elemIndex];
        mockedData[elemIndex] = data;
        return new Promise<any>((resolve) => resolve);
      }),
    callFindOne: (mockedData: MockedData) =>
      sinon.stub(User, "findOne").callsFake(({ where }) => {
        return mockedData.find(
          (e) => e.dataValues.id === (where as any).id
        ) as any;
      }),
    callCreate: (mockedData: MockedData) =>
      sinon.stub(User, "create").callsFake((data: UserModel) => {
        return mockedData.push({
          dataValues: {
            ...data,
            isDeleted: false
          }
        }) as any;
      })
  };

  beforeEach(() => {
    sinon.stub(sequelize, "transaction").callsFake(() => {
      return {
        commit: () => {
          return {};
        },
        rollback: () => {
          return {};
        }
      } as any;
    });
  });

  afterEach(() => {
    mockedReq.params = {};
    mockedRes.clearMockRes();
    sinon.restore();
  });

  test("getUserById method works correctly and returns data and 200 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    req.params.id = "2";
    stubs.callFindOne(mockedUsersData);

    await getUserById(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(resMock.calls.length).toBe(1);
    expect(areEqualsObjects(result, mockedUsersData[1])).toBe(true);
    done();
  });

  test("getUserById method works correctly and returns empty data with 404 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    req.params.id = "500";

    stubs.callFindOne(mockedUsersData);
    await getUserById(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(404);
    expect(resMock.calls.length).toBe(1);
    expect(result).toEqual("User not found");
    done();
  });

  test("getUsersList method works correctly and return data with code 200", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const loginSubstring = "first";

    stubs.callFindAll();

    // should return 2 entity with login which contains 'first' substr
    req.body = {
      limit: 2,
      loginSubstring
    };

    await getUsersList(req, res);

    const mock = (res.send as jest.Mock).mock;
    const statusCode = mock.instances[0].status.mock.calls[0][0];

    /* mock data to be compared */
    const result = mock.calls[0][0];
    const [firstMockRes, secondMockRes] = mockedUsersData
      .filter((e) => e.dataValues.login.includes(loginSubstring))
      .sort((a, b) => a.dataValues.login.localeCompare(b.dataValues.login));

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(mock.calls.length).toBe(1);
    expect(result.length).toBe(2); // "first-mocked-data" && "first-1-mocked-data"
    expect(areEqualsObjects(result[0], firstMockRes)).toBe(true);
    expect(areEqualsObjects(result[1], secondMockRes)).toBe(true);
    done();
  });

  test("getUsersList method works correctly and return empty data with code 200", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const loginSubstring = "random-name";

    stubs.callFindAll();

    // should return 2 entity with login which contains 'first' substr
    req.body = {
      limit: 2,
      loginSubstring
    };

    await getUsersList(req, res);

    const mock = (res.send as jest.Mock).mock;
    const statusCode = mock.instances[0].status.mock.calls[0][0];

    /* mock data to be compared */
    const result = mock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(mock.calls.length).toBe(1);
    expect(result.length).toBe(0); // empty, there are no users with "random-name"
    done();
  });

  test("createNewUser method works correctly and add a new user", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedUsersData];

    req.body = {
      login: "new-user",
      password: "new-user-passwd",
      age: 14
    };

    sinon.stub(User, "findOne").resolves(null);
    stubs.callCreate(mockedData);

    await createNewUser(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(mockedData.some((e) => e.dataValues.login === "new-user")).toBe(
      true
    );
    expect(mockedData.length - mockedUsersData.length).toBe(1);
    done();
  });

  test("deleteUserById method works correctly and delete the user", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedUsersData];

    req.params.id = "1";

    stubs.callUserUpdate(mockedData);
    stubs.callFindOne(mockedData);
    sinon.stub(UserGroupsService, "remove").resolves();

    await deleteUserById(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(mockedData[0].dataValues.isDeleted).toBe(true); // id = "1";
    expect(mockedData.length).toEqual(mockedUsersData.length);
    done();
  });

  test("updateUserInfo method works correctly and update the required user", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedUsersData];

    req.params.id = "4";

    req.body = {
      login: "updated-login-data",
      password: "updated-pass",
      age: 44
    };

    stubs.callUserUpdate(mockedData);
    stubs.callFindOne(mockedData);

    await updateUserInfo(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(mockedData[3].dataValues.login).toEqual("updated-login-data"); // id = "4";
    expect(mockedData[3].dataValues.age).toEqual(44);
    expect(mockedData.length).toEqual(mockedUsersData.length);
    done();
  });
});
