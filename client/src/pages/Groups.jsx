import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import MobileNavbar from '../components/MobileNavbar';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [selectedGroupForMembers, setSelectedGroupForMembers] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { token, user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Redirect or loading if no user
    if (!user) return null;

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleRemoveMember = async (groupId, memberId) => {
        try {
            const response = await axios.patch(`/groups/${groupId}/remove`,
                { userId: memberId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (selectedGroupForMembers && selectedGroupForMembers._id === groupId) {
                setSelectedGroupForMembers(prev => ({
                    ...prev,
                    members: prev.members.filter(m => m._id !== memberId)
                }));
            }

            setGroups(groups.map(g => g._id === groupId ? response.data : g));
            showToast('Member removed', 'success');
        } catch (err) {
            console.error("Error removing member", err);
            showToast('Failed to remove member', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Communities</h2>
                            <Button onClick={() => setShowCreateModal(true)}>+ Create Group</Button>
                        </div>

                        <div className="mb-6">
                            <Input
                                placeholder="Search groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {groups.filter(group =>
                                (group.name && group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).map(group => (
                                <Card key={group._id} variant="default" className="p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl">
                                            👥
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full border ${group.privacy === 'public' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {group.privacy}
                                        </span>
                                    </div>
                                    <h3 onClick={() => navigate(`/groups/${group._id}`)} className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">{group.name}</h3>
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

                                        <button
                                            onClick={() => {
                                                setSelectedGroupForMembers(group);
                                                setShowMembersModal(true);
                                            }}
                                            className="ml-2 text-xs text-primary-600 hover:underline"
                                        >
                                            View Members
                                        </button>

                                    </div>
                                    <Button
                                        size="sm"
                                        variant={group.members.some(m => m._id === user._id) ? "outline" : "primary"}
                                        onClick={() => handleJoinGroup(group._id)}
                                    >
                                        {group.members.some(m => m._id === user._id) ? 'Leave' : 'Join'}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div >

            {/* Create Group Modal */}
            {
                showCreateModal && (
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
                                    <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                    <Button type="submit">Create Group</Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )
            }

            {/* View Members Modal */}
            {
                showMembersModal && selectedGroupForMembers && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <Card className="w-full max-w-md p-6 bg-white max-h-[80vh] flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Members of {selectedGroupForMembers.name}</h3>
                                <button
                                    onClick={() => setShowMembersModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="overflow-y-auto flex-1 space-y-3">
                                {selectedGroupForMembers.members && selectedGroupForMembers.members.length > 0 ? (
                                    selectedGroupForMembers.members.map((member) => (
                                        <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                    {(member.name || member.username) ? (member.name || member.username)[0].toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {member.name || member.username}
                                                        {member.rollNumber && <span className="text-gray-500 font-normal ml-1">({member.rollNumber})</span>}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{member.email || ''}</p>
                                                </div>
                                            </div>

                                            {(user.role === 'admin' || user.role === 'faculty' || user._id === selectedGroupForMembers.creatorId) && user._id !== member._id && (
                                                <button
                                                    onClick={() => handleRemoveMember(selectedGroupForMembers._id, member._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No members yet.</p>
                                )}
                            </div>
                            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                                <Button onClick={() => setShowMembersModal(false)}>Close</Button>
                            </div>
                        </Card>
                    </div>
                )
            }
        </div >
    );
};

export default Groups;
