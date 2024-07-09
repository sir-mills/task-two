import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user?.userId;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { orgs: true }, // Include orgs to check access
        });
        if (!user) {
            return res.status(404).json({
                status: "Not found",
                message: "User not found",
                statusCode: 404,
            });
        }
        // Check if the requesting user has access
        const hasAccess = user.id === requestingUserId ||
            user.orgs.some((org) => org.users.some((u) => u.id === requestingUserId));
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
            data: { user },
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ status: "Error", message: "Server error", statusCode: 500 });
    }
};
