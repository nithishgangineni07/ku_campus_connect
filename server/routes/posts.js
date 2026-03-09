import express from "express";
import { getFeedPosts, createPost, likePost, commentPost, getUserPosts, getGroupPosts, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileUpload.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/group/:groupId", verifyToken, getGroupPosts);

/* POST */
/* POST */
router.post("/", verifyToken, upload.single("picture"), createPost);
router.delete("/:id", verifyToken, deletePost);


/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, commentPost);

export default router;
