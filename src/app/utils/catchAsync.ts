import { NextFunction, Request, RequestHandler, Response } from "express";

//for catching error of async code
const catchAsync = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
