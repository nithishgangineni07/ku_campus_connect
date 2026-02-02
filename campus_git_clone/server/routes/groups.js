import express from "express";
import { createGroup, getGroups, joinGroup } from "../controllers/groups.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getGroups);

/* CREATE */
router.post("/", verifyToken, createGroup);

/* UPDATE */
router.patch("/:id/join", verifyToken, joinGroup);

export default router;
