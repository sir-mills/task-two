import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: { userId: String };
}

export const authenticate = async (
  request: JwtPayload,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorization = request.headers.authorization;
    const token = authorization.split(" ");
    const mainToken = token[1];
    if (!mainToken || mainToken === "") {
      return request.status(401).json({
        status: "Unauthorized",
        message: "No token provided",
        statusCode: 401,
      });
    }
    const decode = jwt.verify(mainToken, `${process.env.APP_SECRET}`);
    if (decode) {
      request.user = decode;
      next();
    }
  } catch (error: any) {
    console.log(error.message);
    response.status(401).json({
      status: "Unauthorized",
      message: "Invalid token",
      statusCode: 401,
    });
  }
};
