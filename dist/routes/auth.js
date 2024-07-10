import express from "express";
import { login } from "../controllers/userController/login.js";
import { register } from "../controllers/userController/register.js";
//import { register, login } from "../controllers/auth.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
export default router;
