import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const login = async (req, res) => {
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
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
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
    }
    catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
        });
    }
};
