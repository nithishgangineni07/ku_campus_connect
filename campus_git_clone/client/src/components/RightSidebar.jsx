import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

const RightSidebar = () => {
    // Mock data - would typically come from an API
    const [trending] = useState([
        { id: 1, tag: '#FinalExams2024', posts: '1.2k', title: 'Exam Season Prep' },
        { id: 2, tag: '#CampusFest', posts: '856', title: 'Annual Cultural Fest' },
        { id: 3, tag: '#InternshipDrive', posts: '2.5k', title: 'Placement Season' },
    ]);

    const [suggestedUsers, setSuggestedUsers] = useState([
        { id: 101, name: 'Alice Johnson', major: 'Computer Science', followed: false },
        { id: 102, name: 'Bob Smith', major: 'Electrical Eng.', followed: false },
    ]);

    const handleFollow = (id) => {
        setSuggestedUsers(prev => prev.map(user =>
            user.id === id ? { ...user, followed: !user.followed } : user
        ));
    };

    return (
        <aside className="hidden lg:block w-80 sticky top-0 h-screen p-6 border-l border-gray-200 overflow-y-auto">
            <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📈</span> Trending Now
                </h3>
                <div className="space-y-3">
                    {trending.map(item => (
                        <Card key={item.id} variant="flat" className="p-4 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                            <p className="text-xs text-gray-500 mb-1 flex justify-between">
                                <span>Trending</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                            </p>
                            <h4 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{item.tag}</h4>
                            <p className="text-sm text-gray-500 mt-1">{item.posts} posts</p>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>👥</span> Suggested People
                </h3>
                <div className="space-y-4">
                    {suggestedUsers.map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center font-semibold text-gray-600">
                                {user.name[0]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-semibold text-sm text-gray-800 truncate">{user.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{user.major}</p>
                            </div>
                            <Button
                                size="sm"
                                variant={user.followed ? "outline" : "primary"}
                                className={`px-3 py-1 text-xs ${user.followed ? 'border-gray-300 text-gray-600' : ''}`}
                                onClick={() => handleFollow(user.id)}
                            >
                                {user.followed ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-8 text-xs text-gray-400 text-center">
                <p>© 2026 Campus Connect</p>
                <div className="flex justify-center gap-2 mt-2">
                    <a href="#" className="hover:underline">Privacy</a> •
                    <a href="#" className="hover:underline">Terms</a> •
                    <a href="#" className="hover:underline">Help</a>
                </div>
            </footer>
        </aside>
    );
};

export default RightSidebar;
