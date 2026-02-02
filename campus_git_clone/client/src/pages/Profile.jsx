import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');

    // Mock data fetch - replace with API call
    useEffect(() => {
        // Simulating API fetch
        setProfileUser({
            _id: userId,
            username: currentUser?._id === userId ? currentUser.username : 'Student User',
            role: currentUser?._id === userId ? currentUser.role : 'Student',
            bio: 'Computer Science Enthusiast | Full Stack Developer',
            followers: 120,
            following: 45,
            posts: 12
        });
    }, [userId, currentUser]);

    if (!profileUser) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Profile</h1>
            </header>

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Profile Header */}
                        <Card variant="glass" className="p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
                            <div className="relative pt-10 px-4 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-4">
                                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                                        {profileUser.username[0]?.toUpperCase()}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{profileUser.username}</h2>
                                <p className="text-primary-600 font-medium">{profileUser.role}</p>
                                <p className="text-gray-600 mt-2 max-w-md">{profileUser.bio}</p>

                                <div className="flex gap-6 mt-6 mb-6">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{profileUser.posts}</div>
                                        <div className="text-xs text-gray-500">Posts</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{profileUser.followers}</div>
                                        <div className="text-xs text-gray-500">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-900">{profileUser.following}</div>
                                        <div className="text-xs text-gray-500">Following</div>
                                    </div>
                                </div>

                                {currentUser._id !== userId && (
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

                        {/* Content Placeholder */}
                        <div className="py-8 text-center text-gray-500">
                            {activeTab === 'posts' && "No posts to show yet."}
                            {activeTab === 'about' && "User details will appear here."}
                            {activeTab === 'activity' && "Recent activity will appear here."}
                        </div>
                    </div>
                </main>

                <RightSidebar />
            </div>
        </div>
    );
};

export default Profile;
