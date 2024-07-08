import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getUserById } from "../controllers/users.js";
const router = express.Router();
router.get("/:id", authenticate, getUserById);
export default router;
