import express from "express";
import { getFeedPosts, createPost, likePost, commentPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);

/* POST */
router.post("/", verifyToken, createPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, commentPost);

export default router;
