import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    userAvatar: String,
    description: String,
    picturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
