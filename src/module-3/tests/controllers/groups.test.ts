import { getMockReq, getMockRes } from "@jest-mock/express";
import sinon from "sinon";
import {
  createNewGroup,
  deleteGroup,
  getGroupById,
  getGroupsList,
  updateGroup
} from "../../controllers/groups";
import sequelize from "../../data-access/";
import Group from "../../models/group";
import * as UserGroupsService from "../../services/user-groups";
import { GroupModel } from "../../types";
import * as utils from "../../utils";
import { areEqualsObjects } from "../../utils";
import { mockedGroupsData } from "../mocks";

type MockedData = Record<"dataValues", GroupModel>[];

describe("check groups controller's methods", () => {
  const mockedReq = getMockReq();
  const mockedRes = getMockRes();

  const stubs = {
    callFindAll: () =>
      sinon.stub(Group, "findAll").resolves(mockedGroupsData as any),
    callGroupUpdate: (mockedData: MockedData) =>
      sinon.stub(Group, "update").callsFake((params, { where }) => {
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

        console.log(mockedData[2]);

        return new Promise<any>((resolve) => resolve);
      }),
    callFindOne: (mockedData: MockedData) =>
      sinon.stub(Group, "findOne").callsFake(({ where }) => {
        return mockedData.find(
          (e) => e.dataValues.id === (where as any).id
        ) as any;
      }),
    callCreate: (mockedData: MockedData) =>
      sinon.stub(Group, "create").callsFake((data: GroupModel) => {
        const ids = mockedData.map((e) => +e.dataValues.id).sort();
        return mockedData.push({
          dataValues: {
            ...data,
            id: String(ids[mockedData.length] + 1)
          }
        }) as any;
      }),
    callDestroy: (mockedData: MockedData) =>
      sinon.stub(Group, "destroy").callsFake(({ where }) => {
        const itemIndex = mockedData.findIndex(
          (e) => e.dataValues.id === (where as any).id
        );
        mockedData.splice(itemIndex, 1);
        return null as any;
        // return new Promise<any>((resolve) => resolve);
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

  xtest("getGroupsList method works correctly and returns data and 200 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    stubs.callFindAll();

    await getGroupsList(req, res);

    const mock = (res.send as jest.Mock).mock;
    const statusCode = mock.instances[0].status.mock.calls[0][0];

    const result = mock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(mock.calls.length).toBe(1);
    expect(result.length).toEqual(3);
    expect(areEqualsObjects(result[0], mockedGroupsData[0])).toBe(true);
    expect(areEqualsObjects(result[1], mockedGroupsData[1])).toBe(true);
    expect(areEqualsObjects(result[2], mockedGroupsData[2])).toBe(true);

    done();
  });

  xtest("getGroupById method works correctly and returns data and 200 code", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;

    req.params.id = "3";
    stubs.callFindOne(mockedGroupsData);

    await getGroupById(req, res);

    const resMock = (res.send as jest.Mock).mock;
    const statusCode = resMock.instances[0].status.mock.calls[0][0];
    const result = resMock.calls[0][0];

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(statusCode).toBe(200);
    expect(resMock.calls.length).toBe(1);
    expect(areEqualsObjects(result, mockedGroupsData[2])).toBe(true);

    done();
  });

  xtest("createNewGroup method works correctly and add a new group", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedGroupsData];

    req.body = {
      name: "new-mocked-group-data",
      permissions: ["DELETE", "READ", "SHARE", "UPLOAD_FILES"]
    };

    sinon.stub(Group, "findOne").resolves(null);
    stubs.callCreate(mockedData);

    await createNewGroup(req, res);

    expect(
      mockedData.some((e) => e.dataValues.name === "new-mocked-group-data")
    ).toBe(true);
    expect(mockedData.length - mockedGroupsData.length).toBe(1);
    done();
  });

  xtest("deleteGroupById method works correctly and delete the group", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedGroupsData];

    req.params.id = "2";

    stubs.callGroupUpdate(mockedData);
    stubs.callFindOne(mockedData);
    stubs.callDestroy(mockedData);
    sinon.stub(UserGroupsService, "remove").resolves();

    await deleteGroup(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(mockedData.find((e) => e.dataValues.id === "2")).toEqual(undefined);
    expect(mockedData.length).toBeLessThan(mockedGroupsData.length);

    done();
  });

  test("updateGroup method works correctly and update the required group", async (done) => {
    const req = mockedReq;
    const res = mockedRes.res;
    const mockedData = [...mockedGroupsData];

    req.params.id = "3";

    req.body = {
      name: "updated-name-group-data",
      permissions: ["DELETE", "READ"]
    };

    stubs.callGroupUpdate(mockedData);
    stubs.callFindOne(mockedData);

    sinon.stub(utils, "areEqualsObjects").resolves(false);

    await updateGroup(req, res);

    // TODO: continue here
    console.log(mockedData[2]);

    done();

    // expect(res.send).toHaveBeenCalledTimes(1);
    // expect(mockedData[3].dataValues.login).toEqual("updated-login-data"); // id = "4";
    // expect(mockedData[3].dataValues.age).toEqual(44);
    // expect(mockedData.length).toEqual(mockedUsersData.length);
  });
});
