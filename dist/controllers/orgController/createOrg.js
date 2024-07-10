import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
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
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
};
