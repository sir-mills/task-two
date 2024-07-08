import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getOrgs = async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        console.log(error.message);
        res
            .status(500)
            .json({ status: "Error", message: "Server error", statusCode: 500 });
    }
};
export const getOrg = async (req, res) => {
    try {
        const { orgId } = req.params;
        const userId = req.user.userId;
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
        if (!org.users.some((user) => user.id === userId)) {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "Error", message: "Server error", statusCode: 500 });
    }
};
export const createOrg = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;
        if (!name) {
            return res.status(422).json({
                errors: [{ field: "name", message: "Name is required" }],
            });
        }
        const org = await prisma.org.create({
            data: {
                name,
                description,
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
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
};
export const addUserToOrg = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { userId } = req.body;
        const requestingUserId = req.user.userId;
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
        if (!org.users.some((user) => user.id === requestingUserId)) {
            return res.status(403).json({
                status: "Forbidden",
                message: "Access denied",
                statusCode: 403,
            });
        }
        await prisma.org.update({
            where: { id: orgId },
            data: {
                users: {
                    connect: { id: userId },
                },
            },
        });
        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
};
