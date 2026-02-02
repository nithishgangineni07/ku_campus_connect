import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/auth/login", { email, password });

            if (response.data.user.role !== 'admin') {
                showToast("Access denied. Not an admin account.", "error");
                setLoading(false);
                return;
            }

            setAuth(response.data.user, response.data.token);
            showToast("Welcome back, Admin!", "success");
            navigate("/");
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Login failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card variant="glass" className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-primary-600">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500 mt-2">Manage Campus Connect</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Admin Email"
                        type="email"
                        placeholder="admin@campusconnect.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? "Authenticating..." : "Login as Admin"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors">
                        ← Back to User Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default AdminLogin;
