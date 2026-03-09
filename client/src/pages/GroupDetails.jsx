import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import Card from '../components/ui/Card';
import PostCard from '../components/PostCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import MobileNavbar from '../components/MobileNavbar';
import DesktopHeader from '../components/DesktopHeader';

const GroupDetails = () => {
    const { groupId } = useParams();
    const { token, user } = useAuth();
    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [image, setImage] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const groupRes = await axios.get(`/groups/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGroup(groupRes.data);

                const postsRes = await axios.get(`/posts/group/${groupId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(postsRes.data);
            } catch (err) {
                console.error("Error fetching group data", err);
                showToast("Failed to load group", "error");
            }
        };

        if (groupId && token) fetchGroupData();
    }, [groupId, token]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("description", newPost);
        formData.append("groupId", groupId); // Add groupId
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        try {
            const response = await axios.post("/posts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Filter posts for this group from the response if the backend returns all posts, 
            // OR ideally backend response should just be the new post or updated list.
            // Our createPost controller returns ALL posts currently. 
            // We should filter them client side or update controller. 
            // For now, let's just refetch or rely on what returns.
            // Wait, createPost returns *all* posts sorted by date. 
            // We should really filter this. But simpler is to reload or filter locally.
            // Let's manually add the new post if we can distinguish it, or just re-fetch.
            // Actually, fetching fresh to contain scope is better.

            const postsRes = await axios.get(`/posts/group/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(postsRes.data);

            setNewPost("");
            setImage(null);
            showToast("Posted successfully!", "success");
        } catch (err) {
            console.error("Error posting", err);
            showToast("Failed to post", "error");
        }
    };

    const handleJoinGroup = async () => {
        try {
            const response = await axios.patch(`/groups/${groupId}/join`,
                { userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGroup(response.data);
            showToast('Group membership updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to update membership', 'error');
        }
    };

    const handleApprove = async (memberId) => {
        try {
            const response = await axios.patch(`/groups/${groupId}/approve`,
                { userId: memberId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGroup(response.data);
            showToast('Member approved', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to approve member', 'error');
        }
    };

    const handleReject = async (memberId) => {
        try {
            const response = await axios.patch(`/groups/${groupId}/reject`,
                { userId: memberId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGroup(response.data);
            showToast('Member rejected', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to reject member', 'error');
        }
    };

    if (!group) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const isMember = group.members.some(m => m._id === user._id);
    const isPending = group.pendingMembers && group.pendingMembers.some(m => m._id === user._id);
    const creatorId = group.creatorId?._id || group.creatorId;
    const canApprove = user._id === creatorId?.toString() || ['admin', 'faculty', 'moderator'].includes(user.role);
    const canPost = isMember || ['admin', 'faculty', 'moderator'].includes(user.role);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <DesktopHeader />
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Card className="p-6 bg-white dark:bg-slate-800 border-transparent dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{group.name}</h1>
                                    <p className="text-gray-600 dark:text-white mb-4">{group.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-white">
                                        <span>{group.members.length} Members</span>
                                        <span className={`px-2 py-0.5 rounded-full border ${group.privacy === 'public' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-white border-gray-200 dark:border-gray-700'}`}>{group.privacy}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant={isMember ? "outline" : (isPending ? "ghost" : "primary")}
                                    onClick={handleJoinGroup}
                                >
                                    {isMember ? 'Leave Group' : (isPending ? 'Cancel Request' : 'Join Group')}
                                </Button>
                            </div>
                        </Card>

                        {/* Pending Approvals Section */}
                        {canApprove && group.pendingMembers && group.pendingMembers.length > 0 && (
                            <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700/30">
                                <h3 className="font-bold text-yellow-800 dark:text-yellow-500 mb-4 flex items-center gap-2">
                                    <span>⏳</span> Pending Approvals ({group.pendingMembers.length})
                                </h3>
                                <div className="space-y-3">
                                    {group.pendingMembers.map(member => (
                                        <div key={member._id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                                                    {(member.name || member.username)?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {member.name || member.username}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-white">
                                                        {member.rollNumber || member.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleReject(member._id)} className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20">Reject</Button>
                                                <Button size="sm" onClick={() => handleApprove(member._id)} className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">Approve</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Create Post in Group */}
                        {canPost && (
                            <Card className="p-4 bg-white dark:bg-slate-800 border-transparent dark:border-gray-700">
                                <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold shrink-0 border border-transparent dark:border-primary-800">
                                            {user.rollNumber?.[0]?.toUpperCase()}
                                        </div>
                                        <Input
                                            placeholder={`What's on your mind, ${user.rollNumber}?`}
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            className="bg-gray-50 dark:bg-slate-900/50 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-gray-300 dark:focus:border-gray-600 transition-colors"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                                        <label className="flex items-center gap-2 text-gray-600 dark:text-white bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer transition-colors px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <span>📎</span>
                                            <span className="text-sm font-medium">Attach File</span>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                onChange={(e) => setImage(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                        {image && <span className="text-sm text-green-600 self-center">{image.name}</span>}
                                        <Button type="submit" disabled={!newPost && !image} className="px-6">Post</Button>
                                    </div>
                                </form>
                            </Card>
                        )}
                        {/* Group Feed */}
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 dark:text-white py-8">No posts in this group yet. Be the first!</div>
                            )}
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default GroupDetails;
