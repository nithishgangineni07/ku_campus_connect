import React from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Card from '../components/ui/Card';
import MobileNavbar from '../components/MobileNavbar';
import { useState } from 'react';

const Notifications = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const notifications = [
        { id: 1, type: 'like', user: 'Jane Doe', content: 'liked your post.', time: '2m ago' },
        { id: 2, type: 'comment', user: 'John Smith', content: 'commented: "Great insight!"', time: '1h ago' },
        { id: 3, type: 'follow', user: 'Admin', content: 'started following you.', time: '5h ago' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Mark all as read</button>
                        </div>

                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <Card key={notif.id} variant="flat" className="p-4 flex items-center gap-4 hover:bg-white transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0
                                        ${notif.type === 'like' ? 'bg-red-100 text-red-500' :
                                            notif.type === 'comment' ? 'bg-blue-100 text-blue-500' :
                                                'bg-green-100 text-green-500'}`}>
                                        {notif.type === 'like' ? '❤️' : notif.type === 'comment' ? '💬' : '👤'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-800">
                                            <span className="font-semibold">{notif.user}</span> {notif.content}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Notifications;
