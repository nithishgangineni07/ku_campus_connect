import express from "express";
import { getUser, updateUser, searchUsers } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);

/* UPDATE */
router.get("/search/:query", verifyToken, searchUsers);
router.patch("/:id", verifyToken, updateUser);

export default router;
