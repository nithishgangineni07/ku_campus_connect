import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExplorePosts = async () => {
            try {
                // In a real app, this might differ from the main feed (e.g., /posts/trending)
                // For now, we'll use the main feed endpoint but display it differently
                const response = await axios.get('/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching explore posts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExplorePosts();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Explore</h1>
            </header>

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover</h2>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {['Trending', 'Technology', 'Art', 'Sports', 'Music', 'Events'].map(topic => (
                                    <Button key={topic} variant="outline" size="sm" className="whitespace-nowrap px-4 rounded-full">
                                        #{topic}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10">Loading discovery...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {posts.map(post => (
                                    <Card key={post._id} variant="default" className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                        {post.picturePath && (
                                            <div className="h-48 overflow-hidden bg-gray-100">
                                                <img
                                                    src={`http://localhost:5000/assets/${post.picturePath}`}
                                                    alt="Post content"
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                    {post.username?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{post.username}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.description}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{Object.keys(post.likes || {}).length} Likes</span>
                                                {/* Placeholder for comments count until implemented */}
                                                <span>{post.comments?.length || 0} Comments</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <RightSidebar />
            </div>
        </div>
    );
};

export default Explore;
