import express from "express";
import { getUser, updateUser, searchUsers, getAllUsers, updateRole } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);

/* UPDATE */
router.get("/search/:query", verifyToken, searchUsers);
router.patch("/:id", verifyToken, updateUser);
router.patch("/:id/role", verifyToken, updateRole);

export default router;
