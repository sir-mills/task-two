import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const register = async (req, res) => {
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
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
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
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400,
        });
    }
};
