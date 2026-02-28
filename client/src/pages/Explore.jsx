import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MobileNavbar from '../components/MobileNavbar';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mode, setMode] = useState('posts'); // 'posts' or 'users'
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchExploreContent();
    }, [token, mode, searchQuery]);

    const fetchExploreContent = async () => {
        setLoading(true);
        try {
            if (mode === 'posts') {
                const response = await axios.get('/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data);
            } else if (mode === 'users' && searchQuery.trim().length > 0) {
                const response = await axios.get(`/users/search/${searchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } else if (mode === 'users') {
                setUsers([]);
            }
        } catch (err) {
            console.error("Error fetching explore content", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (mode === 'users') {
            fetchExploreContent();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover</h2>

                            <div className="flex gap-4 mb-6">
                                <Button
                                    variant={mode === 'posts' ? 'primary' : 'outline'}
                                    onClick={() => setMode('posts')}
                                >
                                    Posts
                                </Button>
                                <Button
                                    variant={mode === 'users' ? 'primary' : 'outline'}
                                    onClick={() => setMode('users')}
                                >
                                    Users
                                </Button>
                            </div>

                            {mode === 'users' && (
                                <form onSubmit={handleSearch} className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search users by name, roll number..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                        <Button type="submit">Search</Button>
                                    </div>
                                </form>
                            )}

                            {mode === 'posts' && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {['Trending', 'Technology', 'Art', 'Sports', 'Music', 'Events'].map(topic => (
                                        <Button key={topic} variant="outline" size="sm" className="whitespace-nowrap px-4 rounded-full">
                                            #{topic}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : (
                            <>
                                {mode === 'posts' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {posts.map(post => (
                                            <Card key={post._id} variant="default" className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                {post.picturePath && (
                                                    <div className="h-48 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/assets/${post.picturePath}`}
                                                            alt="Post content"
                                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                            {(post.name || post.username)?.[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900">{post.name || post.username}</span>
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

                                {mode === 'users' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <Card key={user._id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => window.location.href = `/profile/${user._id}`}>
                                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                                                        {(user.name || user.username)?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{user.name || user.username}</h3>
                                                        <p className="text-sm text-gray-500">{user.rollNumber || (Array.isArray(user.department) ? user.department.join(', ') : user.department)}</p>
                                                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center text-gray-500 py-8">
                                                {searchQuery ? 'No users found matching your search.' : 'Type to search for users.'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Explore;
