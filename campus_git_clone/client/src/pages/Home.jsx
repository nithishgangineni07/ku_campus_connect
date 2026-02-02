import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostFeed from '../components/PostFeed';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

const Home = () => {
    const { user } = useAuth();

    if (user) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Campus Connect</h1>
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                        {user.username?.[0]?.toUpperCase()}
                    </div>
                </header>

                <div className="flex max-w-7xl mx-auto">
                    <LeftSidebar />

                    {/* Main Feed Area */}
                    <main className="flex-1 min-w-0 p-4 md:p-8">
                        <div className="max-w-2xl mx-auto">
                            <PostFeed />
                        </div>
                    </main>

                    <RightSidebar />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Campus Connect</h1>
                <div className="flex gap-4">
                    <Link to="/login">
                        <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary">Get Started</Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto mt-10 md:mt-20">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium animate-fade-in-up">
                    🚀 The #1 Social Platform for Students
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-100">
                    Connect, Collaborate, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Create Together.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                    Join the digital campus community where ideas flow, projects come to life, and friendships begin. Your campus life, amplified.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
                    <Link to="/register">
                        <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg shadow-xl shadow-primary-500/20">
                            Join Now - It's Free
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-white/50 backdrop-blur-sm">
                            Existing User?
                        </Button>
                    </Link>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fade-in-up animation-delay-500">
                    <Card variant="glass" className="p-6 text-left">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
                        <p className="text-gray-600">Connect instantly with peers and faculty members.</p>
                    </Card>
                    <Card variant="glass" className="p-6 text-left">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl mb-4">📅</div>
                        <h3 className="text-xl font-bold mb-2">Events & Groups</h3>
                        <p className="text-gray-600">Discover campus events and join interest groups.</p>
                    </Card>
                    <Card variant="glass" className="p-6 text-left">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl mb-4">📚</div>
                        <h3 className="text-xl font-bold mb-2">Resource Sharing</h3>
                        <p className="text-gray-600">Share notes, projects, and study materials easily.</p>
                    </Card>
                </div>
            </main>

            <footer className="relative z-10 py-8 text-center text-gray-500 text-sm mt-20 border-t border-gray-200">
                <p>© 2026 Campus Connect. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
