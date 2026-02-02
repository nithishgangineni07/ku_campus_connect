import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bio: {
        type: String,
        default: "",
        max: 500
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String
});

const User = mongoose.model('User', userSchema);
export default User;
