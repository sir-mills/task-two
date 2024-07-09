import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !email || !password || !lastName || !phone) {
      return res.status(422).json({
        errors: [
          { field: "firstName", message: "first Name is required" },
          { field: "lastName", message: "last Name is required" },
          { field: "email", message: "email required" },
          { field: "phone", message: "phone number required" },
          { field: "password", message: "password required" },
        ],
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [
          {
            field: "email",
            message: "email already in use",
          },
        ],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        orgs: {
          create: {
            name: `${firstName} org`,
            description: "default org",
            createdBy: {
              connect: { email: email },
            },
          },
        },
      },
      include: { orgs: true },
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!, {
      expiresIn: "4h",
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "Bad request",
        message: "Invalid user or pasword",
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};
