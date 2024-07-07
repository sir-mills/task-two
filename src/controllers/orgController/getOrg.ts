import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrg = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const userId = (req as any).user.userId;

    const org = await prisma.org.findUnique({
      where: { id: orgId },
      include: { users: true },
    });

    if (!org) {
      return res.status(404).json({
        status: "Not found",
        message: "Organisation not found",
        statusCode: 404,
      });
    }

    if (!org.users.some((user: any) => user.id === userId)) {
      return res.status(403).json({
        status: "Forbidden",
        message: "Access denied",
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: {
        orgId: org.id,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: "Error", message: "Server error", statusCode: 500 });
  }
};
