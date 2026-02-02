import React, { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const { user, token } = useAuth();

    const handlePost = async () => {
        try {
            if (!description) return;

            await axios.post('/posts',
                { userId: user._id, description, picturePath: '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDescription('');
            if (onPostCreated) onPostCreated();
        } catch (err) {
            console.error("Error creating post", err);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center gap-4 mb-4">
                {user?.avatar ? (
                    <img src={user.avatar} alt="user" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handlePost}
                    className="px-6 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
