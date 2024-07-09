import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getUserById } from "../controllers/users.js";
const router = express.Router();
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route working" });
});
router.get("/:id", authenticate, getUserById);
export default router;
