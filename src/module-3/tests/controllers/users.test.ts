import { getMockReq, getMockRes } from "@jest-mock/express";
import sinon from "sinon";
import { getUserById, getUsersList } from "../../controllers/users";
// import * as UsersService from "../../services/users";
import User from "../../models/user";
import { areEqualsObjects } from "../../utils";
import { mockedUserData, mockedUsersData } from "../mocks";

describe("check users controller's methods", () => {
  const mockedReq = getMockReq();
  const mockedRes = getMockRes();

  afterEach(() => {
    mockedReq.params = {};
    mockedRes.clearMockRes();
  });

  test("getUserById method works correctly", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    sinon.stub(User, "findOne").resolves(mockedUserData as any);

    await getUserById(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(resMock.calls.length).toBe(1);
    expect(areEqualsObjects(result, mockedUserData)).toBe(true);

    done();
  });

  test("getUsersList method works correctly", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    sinon.stub(User, "findAll").resolves(mockedUsersData as any);

    // should return 2 entity with login which contains 'first' substr
    req.body = {
      limit: 2,
      loginSubstring: "first"
    };

    await getUsersList(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(resMock.calls.length).toBe(1);
    expect(areEqualsObjects(result[0], mockedUsersData[5])).toBe(true);
    expect(areEqualsObjects(result[1], mockedUsersData[0])).toBe(true);
    done();
  });
});
