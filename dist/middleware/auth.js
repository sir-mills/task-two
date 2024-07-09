import jwt from "jsonwebtoken";
export const authenticate = async (request, response, next) => {
    try {
        const authorization = request.headers.authorization;
        const token = authorization.split(" ");
        const mainToken = token[1];
        if (!mainToken || mainToken === "") {
            return request.status(401).json({
                status: "Unauthorized",
                message: "No token provided",
                statusCode: 401,
            });
        }
        const decode = jwt.verify(mainToken, `${process.env.APP_SECRET}`);
        if (decode) {
            request.user = decode;
            next();
        }
    }
    catch (error) {
        console.log(error.message);
        response.status(401).json({
            status: "Unauthorized",
            message: "Invalid token",
            statusCode: 401,
        });
    }
};
