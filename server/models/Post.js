import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    userAvatar: String,
    description: String,
    picturePath: String,
    filePath: String,
    originalFileName: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        type: Array,
        default: []
    },
    groupId: {
        type: String,
        default: null
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
