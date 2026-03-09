import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import MobileNavbar from '../components/MobileNavbar';
import DesktopHeader from '../components/DesktopHeader';
import { useToast } from '../context/ToastContext';
import LeftSidebar from '../components/LeftSidebar';

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mode, setMode] = useState('posts'); // 'posts' or 'users'
    const { token, user: currentUser } = useAuth();
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
                const response = await axios.get(`/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
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

    const { showToast } = useToast();

    const handleRoleUpdate = async (e, userId, currentRole) => {
        e.stopPropagation();

        // Admins can toggle between student and moderator easily
        // If they want to make someone faculty, that could be another button, but for MVP, let's toggle moderator
        let newRole = 'student';
        if (currentRole === 'student') newRole = 'moderator';
        else if (currentRole === 'moderator') newRole = 'student';

        try {
            const response = await axios.patch(`/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(u => u._id === userId ? { ...u, role: response.data.role } : u));
            showToast(`Role updated to ${response.data.role}`, 'success');
        } catch (err) {
            console.error("Error updating role", err);
            showToast('Failed to update role', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <DesktopHeader />
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discover</h2>

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

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={mode === 'users' ? "Search users by name, roll number..." : "Search posts by content, author..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                                    />
                                    <Button type="submit">Search</Button>
                                </div>
                            </form>
                        </div>

                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : (
                            <>
                                {mode === 'posts' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {posts.filter(post =>
                                            !searchQuery.trim() ||
                                            (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                            (post.name && post.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                            (post.username && post.username.toLowerCase().includes(searchQuery.toLowerCase()))
                                        ).map(post => (
                                            <Card key={post._id} variant="default" className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                {post.picturePath && (
                                                    <div className="h-48 overflow-hidden bg-gray-100 dark:bg-slate-800">
                                                        <img
                                                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/assets/${post.picturePath}`}
                                                            alt="Post content"
                                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold border border-transparent dark:border-primary-800">
                                                            {(post.name || post.username)?.[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{post.name || post.username}</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-white text-sm line-clamp-3 mb-3">{post.description}</p>
                                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white">
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
                                    <div className="space-y-8">
                                        {users.length > 0 ? (
                                            searchQuery.trim().length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {users.map(user => (
                                                        <Card key={user._id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-transparent dark:border-gray-700 bg-white dark:bg-slate-800" onClick={() => window.location.href = `/profile/${user._id}`}>
                                                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl border border-transparent dark:border-primary-800 shrink-0">
                                                                {(user.name || user.username)?.[0]?.toUpperCase()}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-gray-900 dark:text-white">{user.name || user.username}</h3>
                                                                <p className="text-sm text-gray-500 dark:text-white">{user.rollNumber || (Array.isArray(user.department) ? user.department.join(', ') : user.department)}</p>
                                                                <p className="text-xs text-gray-400 dark:text-white capitalize">{user.role}</p>
                                                            </div>
                                                            {['admin', 'faculty'].includes(currentUser?.role) && currentUser?._id !== user._id && user.role !== 'admin' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={(e) => handleRoleUpdate(e, user._id, user.role)}
                                                                    className="shrink-0"
                                                                >
                                                                    {user.role === 'moderator' ? 'Demote' : 'Make Mod'}
                                                                </Button>
                                                            )}
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                // Group users by department when not searching
                                                Object.entries(
                                                    users.reduce((acc, user) => {
                                                        const dept = Array.isArray(user.department) ? user.department[0] : (user.department || 'Other');
                                                        if (!acc[dept]) acc[dept] = [];
                                                        acc[dept].push(user);
                                                        return acc;
                                                    }, {})
                                                ).sort(([deptA], [deptB]) => deptA.localeCompare(deptB))
                                                    .map(([department, deptUsers]) => (
                                                        <div key={department} className="mb-6">
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                                                {department}
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {deptUsers.map(user => (
                                                                    <Card key={user._id} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-transparent dark:border-gray-700 bg-white dark:bg-slate-800" onClick={() => window.location.href = `/profile/${user._id}`}>
                                                                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl border border-transparent dark:border-primary-800 shrink-0">
                                                                            {(user.name || user.username)?.[0]?.toUpperCase()}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <h3 className="font-bold text-gray-900 dark:text-white">{user.name || user.username}</h3>
                                                                            <p className="text-sm text-gray-500 dark:text-white">{user.rollNumber}</p>
                                                                            <p className="text-xs text-gray-400 dark:text-white capitalize">{user.role}</p>
                                                                        </div>
                                                                        {['admin', 'faculty'].includes(currentUser?.role) && currentUser?._id !== user._id && user.role !== 'admin' && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={(e) => handleRoleUpdate(e, user._id, user.role)}
                                                                                className="shrink-0"
                                                                            >
                                                                                {user.role === 'moderator' ? 'Demote' : 'Make Mod'}
                                                                            </Button>
                                                                        )}
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))
                                            )
                                        ) : (
                                            <div className="text-center text-gray-500 dark:text-white py-8">
                                                {searchQuery ? 'No users found matching your search.' : 'No users found.'}
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
