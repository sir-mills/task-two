import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
        return res.status(401).json({
            status: "Unauthorized",
            message: "No token provided",
            statusCode: 401,
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        req.user = decoded;
    }
    catch (error) {
        res.status(401).json({
            status: "Unauthorized",
            message: "Invalid token",
            statusCode: 401,
        });
    }
};
