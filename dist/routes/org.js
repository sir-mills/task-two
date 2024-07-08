import express from "express";
import { authenticate } from "../middleware/auth.js";
import { getOrg, getOrgs, createOrg, addUserToOrg, } from "../controllers/org.js"; //add delete org here.
const router = express.Router();
router.get("/", authenticate, getOrgs);
router.get("/:orgId", authenticate, getOrg);
router.post("/", authenticate, createOrg);
router.post("/:orgId/user", authenticate, addUserToOrg);
export default router;
