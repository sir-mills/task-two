import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import orgRoutes from "./routes/org.js";

const app = express();
dotenv.config();

app.get("/api/users/test", (req, res) => {
  res.json({ message: "Test route in app.ts is working" });
});

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/org", orgRoutes);

const port = process.env.PORT || 1001;
app.listen(process.env.PORT || 1001, () =>
  console.log(`server is active on ${port}`)
);
export default app;
