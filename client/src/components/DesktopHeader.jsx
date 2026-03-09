import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const DesktopHeader = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <header className="hidden md:flex sticky top-0 z-100 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-3 justify-between items-center">
            <div className="flex items-center gap-3">
                <Link to="/">
                    <h1 className="text-2xl font-bold bg-clip-text z-50 text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                        Campus Connect
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link to={`/profile/${user._id}`}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg hover:ring-2 ring-primary-500 transition-all">
                        {user.rollNumber?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase()}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default DesktopHeader;
