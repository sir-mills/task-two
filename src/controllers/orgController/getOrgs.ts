import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrgs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const orgs = await prisma.org.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { orgs },
    });
  } catch (error: any) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: "Error", message: "Server error", statusCode: 500 });
  }
};
