import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const addUserToOrganisation = async (req, res) => {
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
