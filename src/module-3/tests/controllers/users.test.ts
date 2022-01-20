import { mockRequest, mockResponse } from "../interceptors";
import usersControllers from "../../controllers/users";

describe("check users controller's method", () => {
  test("should return code 200 and correct val", async () => {
    const req = mockRequest();
    req.params.id = "1";
    const res = mockResponse();

    // await usersControllers.get(req, res);
  });
});
