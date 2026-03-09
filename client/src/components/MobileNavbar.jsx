import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const MobileNavbar = ({ onOpenSidebar }) => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <header className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                    Campus Connect
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link to={`/profile/${user._id}`}>
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                        {user.rollNumber?.[0]?.toUpperCase()}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default MobileNavbar;
