import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import orgRoutes from "./routes/org";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("api/user", userRoutes);
app.use("api/organization", orgRoutes);

const PORT = process.env.port || 1001;
app.listen(process.env.PORT || 1001, () =>
  console.log(`server is active on ${PORT}`)
);
export default app;
