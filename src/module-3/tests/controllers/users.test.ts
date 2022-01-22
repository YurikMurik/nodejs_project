// import usersControllers from "../../controllers/users";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { getUserById } from "../../controllers/users";

describe("check users controller's method", () => {
  // afterAll((done) => {
  //   // Closing the DB connection allows Jest to exit successfully.
  //   done();
  // });

  // beforeAll((done) => {
  //   // Closing the DB connection allows Jest to exit successfully.
  //   done();
  // });
  beforeEach((done) => {
    done();
    // jest.useFakeTimers("legacy");
    // jest.setTimeout(100000);
  });

  afterEach((done) => {
    done();
    // jest.clearAllTimers();
    // done();
  });

  test("should return code 200 and correct val", async (done) => {
    // const req = getMockReq();
    // const { res } = getMockRes();
    // req.params.id = "1";

    // getUserById(req, res);
    await getUserById(null, null);

    // done();
    // return new Promise(null);

    // expect(res.send).toHaveBeenCalledTimes(1);
    // expect(res.send.//calls.length).toBe(1);
    // expect(res.send).toHaveBeenCalledWith('Hello i am todo controller');
    // done();
    // console.log(usersControllers.get);

    // done();
  });
});
