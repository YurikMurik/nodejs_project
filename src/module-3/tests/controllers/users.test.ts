import { getMockReq, getMockRes } from "@jest-mock/express";
import sinon from "sinon";
import {
  createNewUser,
  getUserById,
  getUsersList
} from "../../controllers/users";
// import * as UsersService from "../../services/users";
import User from "../../models/user";
import * as UserGroupsService from "../../services/user-groups";
import { UserModel } from "../../types";
import { areEqualsObjects } from "../../utils";
import { mockedUsersData } from "../mocks";

describe("check users controller's methods", () => {
  const mockedReq = getMockReq();
  const mockedRes = getMockRes();

  afterEach(() => {
    mockedReq.params = {};
    mockedRes.clearMockRes();
    sinon.restore();
    // sinon.stub
  });

  xtest("getUserById method works correctly and returns data and 200 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    req.params.id = "2";

    sinon.stub(User, "findOne").callsFake(({ where }) => {
      return mockedUsersData.find(
        (e) => e.dataValues.id === (where as any).id
      ) as any;
    });

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

  xtest("getUserById method works correctly and returns empty data with 404 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    req.params.id = "500";

    sinon.stub(User, "findOne").callsFake(({ where }) => {
      return mockedUsersData.find(
        (e) => e.dataValues.id === (where as any).id
      ) as any;
    });

    await getUserById(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    console.log({ result });

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(404);
    expect(resMock.calls.length).toBe(1);
    expect(result).toEqual("User not found");
    done();
  });

  xtest("getUsersList method works correctly and return data with code 200", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const loginSubstring = "first";

    sinon.stub(User, "findAll").resolves(mockedUsersData as any);

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

  xtest("getUsersList method works correctly and return empty data with code 200", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const loginSubstring = "random-name";

    sinon.stub(User, "findAll").resolves(mockedUsersData as any);

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
    sinon.stub(User, "create").callsFake((data: UserModel) => {
      return mockedData.push({
        dataValues: {
          ...data,
          isDeleted: false
        }
      }) as any;
    });

    await createNewUser(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockedData.some((e) => e.dataValues.login === "new-user")).toBe(
      true
    );
    expect(mockedData.length - mockedUsersData.length).toBe(1);
    done();
  });

  test("createNewUser method works correctly and add a new user", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedUsersData];

    req.params.id = "1";

    sinon.stub(User, "findOne").callsFake(({ where }) => {
      return mockedData.find(
        (e) => e.dataValues.id === (where as any).id
      ) as any;
    });

    sinon.stub(UserGroupsService, "remove").resolves();

    // TODO: continue here
  });
});
