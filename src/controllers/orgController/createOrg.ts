import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrg = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = (req as any).user.userId;

    if (!name) {
      return res.status(422).json({
        errors: [{ field: "name", message: "Name is required" }],
      });
    }

    const org = await prisma.org.create({
      data: {
        name,
        description,
        createdBy: {
          connect: { id: userId },
        },
        users: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: org.id,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
};
