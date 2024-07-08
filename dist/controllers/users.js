import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { orgs: true },
        });
        if (!user) {
            return res.status(404).json({
                status: "Not found",
                message: "User not found",
                statusCode: 404,
            });
        }
        //will come backfor this logic
        const hasAccess = user.id === userId ||
            user.orgs.some((org) => org.users.some((u) => u.id === userId));
        if (!hasAccess) {
            return res.status(403).json({
                status: "Forbidden",
                message: "Access denied",
                statusCode: 403,
            });
        }
        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "Error", message: "Server error", statusCode: 500 });
    }
};
