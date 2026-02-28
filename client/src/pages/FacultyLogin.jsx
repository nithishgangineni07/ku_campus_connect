import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const FacultyLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            // Verify role if strict faculty login is required, 
            // but usually auth context handles session. 
            // We can assume if they have creds they can login here.
            // Or we could check user role after login if needed, 
            // but login usually returns user object.
            // For now standard login flow.
            showToast('Welcome back, Faculty!', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.msg || 'Failed to login', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <Card variant="glass" className="w-full  max-w-md p-8 relative z-10 m-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Faculty Portal</h2>
                    <p className="text-gray-300 mt-2">Sign in to manage courses and groups</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Faculty Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="professor@university.edu"
                        required
                        className="text-gray-900"
                        labelClassName="text-gray-200"
                    />

                    <div className="space-y-1">
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="text-gray-900"
                            labelClassName="text-gray-200"
                        />
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-purple-300 hover:text-purple-200 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Sign In as Faculty
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-300">
                    Not a faculty member?{' '}
                    <Link to="/login" className="font-semibold text-white hover:underline">
                        Student Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default FacultyLogin;
