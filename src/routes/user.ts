import express from "express";
import { authenticate } from "../middleware/auth";
import { getUserById } from "../controllers/user";

const router = express.Router();

router.get("/:id", authenticate, getUserById);

export default router;
