import { Request, Response } from "express";
import "jest";

// TODO: should be deleted
export const mockRequest = () => {
  const req = {} as Request;
  req.body = jest.fn().mockReturnValue(req);
  // TODO: should be fixed
  req.params = jest.fn().mockReturnValue(req) as any;
  return req;
};

export const mockResponse = () => {
  const res = {} as Response;
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
