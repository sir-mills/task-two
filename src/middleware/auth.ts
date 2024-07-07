import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticate = (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "No token provided",
      statusCode: 401,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET!);
    (req as any).user = decoded;
  } catch (error) {
    res.status(401).json({
      status: "Unauthorized",
      message: "Invalid token",
      statusCode: 401,
    });
  }
};
