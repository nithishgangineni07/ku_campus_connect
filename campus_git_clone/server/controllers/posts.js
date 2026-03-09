import Post from "../models/Post.js";
import User from "../models/User.js";
import Group from "../models/Group.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, groupId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // RBAC: If it's a global post, must be admin, faculty, or moderator
        if (!groupId && !['admin', 'faculty', 'moderator'].includes(user.role)) {
            return res.status(403).json({ message: "Access denied. Students cannot create global posts." });
        }

        // RBAC: If it's a group post, user must be a member of the group, or an admin/faculty/moderator
        if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) return res.status(404).json({ message: "Group not found" });

            const isMember = group.members.some(memberId => memberId.toString() === userId);
            if (!isMember && !['admin', 'faculty', 'moderator'].includes(user.role)) {
                return res.status(403).json({ message: "Access denied. You must be a member of this group to post." });
            }
        }

        let picturePath = null;
        let filePath = null;
        let originalFileName = null;

        if (req.file) {
            originalFileName = req.file.originalname;
            const mimetype = req.file.mimetype;

            if (mimetype.startsWith('image/')) {
                picturePath = req.file.filename;
            } else {
                filePath = req.file.filename;
            }
        } else if (req.body.picturePath) {
            // Fallback if frontend sends it in body (older logic)
            // But with Multer, usually req.file is the source of truth for new uploads
            // Check if it's an image or doc name string
            if (req.body.picturePath.match(/\.(jpg|jpeg|png|gif)$/i)) {
                picturePath = req.body.picturePath;
            } else {
                filePath = req.body.picturePath;
            }
        }

        const newPost = new Post({
            userId,
            name: user.name || "Campus Connect User",
            rollNumber: user.rollNumber,
            userRole: user.role,
            userAvatar: user.avatar,
            description,
            picturePath,
            filePath,
            originalFileName,
            likes: {},
            comments: [],
            groupId: groupId || null
        });
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(post);
    } catch (err) {
        console.error("DEBUG 409 CREATE POST ERROR:", err);
        res.status(409).json({ message: err.message });
    }
};

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const postAuthor = await User.findById(post.userId);
        const postAuthorRole = postAuthor ? postAuthor.role : 'student';

        // Check if user is creator or admin/faculty/moderator
        // req.user is set by verifyToken middleware (decodes JWT)
        if (req.user.id !== post.userId && !['admin', 'faculty', 'moderator'].includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. You can only delete your own posts." });
        }

        // If moderator is trying to delete, ensure they aren't deleting an admin's or faculty's post
        if (req.user.role === 'moderator' && req.user.id !== post.userId && ['admin', 'faculty'].includes(postAuthorRole)) {
            return res.status(403).json({ message: "Access denied. Moderators cannot delete admin or faculty posts." });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        // Fetch posts that are NOT associated with a group for the main feed
        // OR fetch all posts (depending on preference). Let's fetch non-group posts for main feed.
        const post = await Post.find({ groupId: null }).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const post = await Post.find({ groupId }).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};



/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* COMMENT */
export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, comment } = req.body;

        const user = await User.findById(userId);
        const post = await Post.findById(id);

        const newComment = {
            userId,
            name: user.name,
            rollNumber: user.rollNumber,
            userAvatar: user.avatar,
            comment,
            createdAt: new Date()
        };

        post.comments.push(newComment);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
