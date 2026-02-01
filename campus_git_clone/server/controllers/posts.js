import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            username: user.username,
            userAvatar: user.avatar,
            description,
            picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });
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
            username: user.username,
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
