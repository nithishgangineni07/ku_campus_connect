import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { token, user } = useAuth();
    const { showToast } = useToast();

    // Redirect or loading if no user
    if (!user) return null;

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGroups(response.data);
        } catch (err) {
            console.error("Error fetching groups", err);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/groups',
                { name, description, privacy, creatorId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGroups([...groups, response.data]);
            setShowCreateModal(false);
            setName('');
            setDescription('');
            showToast('Group created successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to create group', 'error');
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const response = await axios.patch(`/groups/${groupId}/join`,
                { userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setGroups(groups.map(g => g._id === groupId ? response.data : g));
            showToast('Group membership updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to update membership', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Groups</h1>
            </header>

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Communities</h2>
                            <Button onClick={() => setShowCreateModal(true)}>+ Create Group</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {groups.map(group => (
                                <Card key={group._id} variant="default" className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl">
                                            👥
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${group.privacy === 'public' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {group.privacy}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                                    <p className="text-gray-600 text-sm mb-6 flex-1">{group.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex -space-x-2">
                                            {/* Member avatars placeholder */}
                                            {[...Array(Math.min(3, group.members.length))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                            ))}
                                            {group.members.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                                                    +{group.members.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={group.members.includes(user._id) ? "outline" : "primary"}
                                            onClick={() => handleJoinGroup(group._id)}
                                        >
                                            {group.members.includes(user._id) ? 'Leave' : 'Join'}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>

                <RightSidebar />
            </div>

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 bg-white">
                        <h3 className="text-xl font-bold mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <Input
                                label="Group Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit">Create Group</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Groups;
