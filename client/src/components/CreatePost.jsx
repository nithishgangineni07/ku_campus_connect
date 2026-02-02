import React, { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const { user, token } = useAuth();

    const handlePost = async () => {
        try {
            if (!description && !file) return;

            const formData = new FormData();
            formData.append('userId', user._id);
            formData.append('description', description);
            if (file) {
                // Determine if it is an image or doc based on type or let backend handle
                // Backend creates 'picturePath' or 'filePath' based on mimetype
                // We send it as 'picture' key as configured in routes/middleware
                formData.append('picture', file);
                formData.append('picturePath', file.name); // Legacy support if needed, but backend handles it
            }

            await axios.post('/posts',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDescription('');
            setFile(null);
            if (onPostCreated) onPostCreated();
        } catch (err) {
            console.error("Error creating post", err);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-start gap-4 mb-4">
                {user?.avatar ? (
                    <img src={user.avatar} alt="user" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white shrink-0">
                        {user?.rollNumber?.[0]?.toUpperCase()}
                    </div>
                )}
                <div className="w-full">
                    <input
                        type="text"
                        placeholder={`What's on your mind, ${user?.rollNumber}?`}
                        className="w-full bg-gray-100 rounded-full px-4 py-2 focus:outline-none mb-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {file && (
                        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md inline-flex items-center gap-2">
                            <span>📎 {file.name}</span>
                            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">✕</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
                <label className="flex items-center gap-2 text-gray-500 hover:text-primary-600 cursor-pointer transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                    <span>📎</span>
                    <span className="text-sm font-medium">Attach File</span>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                    />
                </label>
                <button
                    onClick={handlePost}
                    className="px-6 py-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition disabled:opacity-50"
                    disabled={!description && !file}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
