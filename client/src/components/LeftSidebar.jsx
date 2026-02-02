import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LeftSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: '🏠', label: 'Home', path: '/' },
        { icon: '🔍', label: 'Explore', path: '/explore' },
        { icon: '👥', label: 'Groups', path: '/groups' },
        { icon: '📅', label: 'Events', path: '/events' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '👤', label: 'Profile', path: `/profile/${user?._id}` },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:block
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col p-6 overflow-y-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Campus Connect</h1>
                        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <nav className="space-y-2 mb-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                                    }
                                `}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/profile/${user?._id}`)}>
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg ring-2 ring-white shadow-sm">
                                {user?.username?.[0]?.toUpperCase() || user?.rollNumber?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-semibold text-gray-900 truncate">{user?.username || user?.rollNumber}</h4>
                                <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default LeftSidebar;
