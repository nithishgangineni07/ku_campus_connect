import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);


    const dummyCredentials = [
        {
            email: "sanjana@gmail.com",
            password: "123456",
            role: "student"
        },
        {
            email: "ashok@gmail.com",
            password: "123456",
            role: "faculty"
        },
        {
            email: "rajureddy10@gmail.com",
            password: "123456",
            role: "faculty"
        },
        {
            email: "krupa@gmail.com",
            password: "123456",
            role: "moderator"
        },
        {
            email: "tanisha@gmail.com",
            password: "123456",
            role: "student"
        },
    ];

    //left and right logic

    const nextCredential = () => {
        setCurrentIndex((prev) => (prev + 1) % dummyCredentials.length);
    };

    const prevCredential = () => {
        setCurrentIndex((prev) =>
            prev == 0 ? dummyCredentials.length - 1 : prev - 1);
    };

    //logic for auto filling password on clicking dummy

    const fillCredentials = () => {
        setEmail(current.email);
        setPassword(current.password);

    };

    const current = dummyCredentials[currentIndex];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            showToast('Welcome back!', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to login', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('http://kucet.ac.in/img/sliders/KU_Home.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <Card variant="glass" className="w-full  max-w-md p-8 relative z-10 m-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Welcome Back</h2>
                    <p className="text-gray-500 dark:text-white mt-2">Sign in to continue to Campus Connect</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        required
                    />

                    <div className="space-y-1">
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div className="text-gray-500 mt-2 text-center">

                        <h4>Dummy Credentials</h4>

                    </div>

                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">



                        {/* Left Arrow */}
                        <button
                            onClick={prevCredential}
                            className="w-12 h-16 flex items-center justify-center border-r border-gray-300 hover:bg-blue-100 transition-all text-xl font-bold cursor-pointer"
                        >
                            ←
                        </button>



                        {/* Credentials */}
                        <div
                            onClick={fillCredentials}
                            className="flex-1 px-4 py-2 text-center cursor-pointer hover:bg-gray-50"
                        >

                            <p>
                                <span className="font-semibold">Email:</span> {current.email}
                            </p>
                            <p>
                                <span className="font-semibold">Password:</span> {current.password}
                            </p>
                            <p>
                                <span className="font-semibold">Role:</span> {current.role}
                            </p>
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={nextCredential}
                            className="w-12 h-16 flex items-center justify-center border-l border-gray-300 hover:bg-blue-100 transition-all text-xl font-bold cursor-pointer"
                        >
                            →
                        </button>

                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-white">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                        Create account
                    </Link>
                </div>
                <div className="mt-6 text-center text-xs text-gray-400 dark:text-white">
                    <Link to="/admin-login" className="hover:text-primary-600 transition-colors">
                        Admin Portal
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;
