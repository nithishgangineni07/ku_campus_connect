import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/auth/forgot-password', { email });
            showToast('Password reset link has been sent to your email.', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send reset email', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <Card variant="default" className="w-full max-w-md p-8 relative z-10 m-4">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                    <p className="text-gray-500 mt-2">Enter your email to receive a password reset link.</p>
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

                    <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                        Send Reset Link
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        Back to Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
