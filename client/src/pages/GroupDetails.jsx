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

    if (!group) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <Card className="p-6 bg-white">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                            <p className="text-gray-600 mb-4">{group.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{group.members.length} Members</span>
                                <span className={`px-2 py-0.5 rounded-full border ${group.privacy === 'public' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{group.privacy}</span>
                            </div>
                        </Card>

                        {/* Create Post in Group */}
                        <Card className="p-4 bg-white">
                            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold shrink-0">
                                        {user.rollNumber?.[0]?.toUpperCase()}
                                    </div>
                                    <Input
                                        placeholder={`What's on your mind, ${user.rollNumber}?`}
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                        className="bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="flex justify-between items-center border-t pt-3">
                                    <label className="flex items-center gap-2 text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors px-4 py-2 rounded-lg border border-gray-200">
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

                        {/* Group Feed */}
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8">No posts in this group yet. Be the first!</div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GroupDetails;
