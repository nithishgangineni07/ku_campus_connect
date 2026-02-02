import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const { token } = useAuth();

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="max-w-2xl mx-auto p-4">
            <CreatePost onPostCreated={fetchPosts} />
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
                {posts.length === 0 && (
                    <div className="text-center text-gray-500 py-10">No posts yet. Be the first to post!</div>
                )}
            </div>
        </div>
    );
};

export default PostFeed;
