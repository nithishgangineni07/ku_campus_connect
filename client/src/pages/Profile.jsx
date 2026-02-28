import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PostCard from '../components/PostCard'; // Import PostCard
import Input from '../components/ui/Input'; // Import Input
import { useToast } from '../context/ToastContext';
import MobileNavbar from '../components/MobileNavbar';

const Profile = () => {
    const { userId } = useParams();
    const { token, user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { showToast } = useToast();

    // Fetch user and posts
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userRes = await axios.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileUser(userRes.data);
                setEditBio(userRes.data.bio || '');

                const postsRes = await axios.get(`/posts/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserPosts(postsRes.data);

            } catch (err) {
                console.error("Error fetching profile", err);
                showToast("Failed to load profile", "error");
            }
        };

        if (userId && token) fetchProfileData();
    }, [userId, token]);

    const handleUpdateBio = async () => {
        try {
            const response = await axios.patch(`/users/${userId}`,
                { bio: editBio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfileUser(response.data);
            setIsEditing(false);
            showToast("Bio updated successfully", "success");
        } catch (err) {
            console.error("Error updating bio", err);
            showToast("Failed to update bio", "error");
        }
    };

    if (!profileUser) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const isOwnProfile = currentUser?._id === userId;

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Profile Header */}
                        <Card variant="glass" className="p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
                            <div className="relative pt-10 px-4 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-4">
                                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                                        {(profileUser.name || profileUser.rollNumber)?.[0]?.toUpperCase()}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{profileUser.name}</h2>
                                {profileUser.role === 'student' && <p className="text-gray-500">{profileUser.rollNumber}</p>}
                                <p className="text-primary-600 font-medium capitalize">{profileUser.role}</p>

                                {isEditing ? (
                                    <div className="mt-4 w-full max-w-md">
                                        <Input
                                            value={editBio}
                                            onChange={(e) => setEditBio(e.target.value)}
                                            placeholder="Enter your bio..."
                                            className="text-center"
                                        />
                                        <div className="flex justify-center gap-2 mt-2">
                                            <Button size="sm" onClick={handleUpdateBio}>Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 mt-2 max-w-md">{profileUser.bio || "No bio yet."}</p>
                                )}

                                <div className="flex gap-6 mt-6 mb-6">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{userPosts.length}</div>
                                        <div className="text-xs text-gray-500">Posts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{profileUser.followers || 0}</div>
                                        <div className="text-xs text-gray-500">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{profileUser.following || 0}</div>
                                        <div className="text-xs text-gray-500">Following</div>
                                    </div>
                                </div>

                                {isOwnProfile ? (
                                    !isEditing && <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                ) : (
                                    <Button>Follow</Button>
                                )}
                            </div>
                        </Card>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            {['Posts', 'About', 'Activity'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="py-4">
                            {activeTab === 'posts' && (
                                <div className="space-y-6">
                                    {userPosts.length > 0 ? (
                                        userPosts.map(post => (
                                            <PostCard key={post._id} post={post} />
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-8">No posts yet.</div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'about' && (
                                <div className="text-center text-gray-500 py-8">
                                    <p>Email: {profileUser.email}</p>
                                    <p>Joined: {new Date(profileUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}
                            {activeTab === 'activity' && "Recent activity will appear here."}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
