import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
  statusCode:number;
  constructor(message:string, statusCode:number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends CustomError {
  constructor(message = "This User is not found") {
    super(message, 404);
  }
}
export class BadRequest extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}
export class UnAuthorized extends CustomError {
  constructor(message = "You are not authorized to access.") {
    super(message, 401);
  }
}
export default function errorHandler(err:Error|CustomError, req:Request, res:Response, next:NextFunction) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error.", error: err.message });
  }
}
