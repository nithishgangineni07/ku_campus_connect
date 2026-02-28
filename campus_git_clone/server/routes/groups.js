import express from "express";
import { createGroup, getGroups, joinGroup, getGroup, deleteGroup, removeMember } from "../controllers/groups.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getGroups);
router.get("/:id", verifyToken, getGroup);

/* CREATE */
router.post("/", verifyToken, createGroup);

/* UPDATE */
router.patch("/:id/join", verifyToken, joinGroup);
router.patch("/:id/remove", verifyToken, removeMember);
router.delete("/:id", verifyToken, deleteGroup);

export default router;
