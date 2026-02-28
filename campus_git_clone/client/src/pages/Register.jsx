
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    role: 'student',
    department: [] // Store as array for consistency
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const departments = [
    "Computer Science and Engineering (CSE)",
    "Information Technology (IT)",
    "Computer Science and Data Science (CSD)",
    "Electrical and Electronics Engineering (EEE)",
    "Electronics and Communication Engineering (ECE)",
    "Mechanical Engineering (Mech)",
    "Civil Engineering (Civil)",
    "Office",
    "Library"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    const { value, checked } = e.target;
    let updatedDepartments = [...formData.department];

    if (formData.role === 'student') {
      // Single selection for students
      updatedDepartments = [value];
    } else {
      // Multiple selection for faculty
      if (checked) {
        updatedDepartments.push(value);
      } else {
        updatedDepartments = updatedDepartments.filter(dept => dept !== value);
      }
    }
    setFormData({ ...formData, department: updatedDepartments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.role === 'student') {
      const { rollNumber } = formData;
      if (rollNumber.length !== 10) {
        showToast("Roll number must be exactly 10 characters", "error");
        return;
      }
      if (rollNumber.substring(2, 5) !== "567") {
        showToast("Roll number must contain '567' as the 3rd, 4th, and 5th characters (e.g., AB567...)", "error");
        return;
      }
    }

    if (formData.department.length === 0) {
      showToast("Please select at least one department", "error");
      return;
    }

    setIsLoading(true);
    try {
      await register(
        formData.rollNumber,
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.department
      );
      showToast('Registration successful! Please login.', 'success');
      navigate(formData.role === 'faculty' ? '/faculty-login' : '/login');
    } catch (err) {
      console.error("Registration Error:", err);
      showToast(err.response?.data?.error || 'Failed to register', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')] bg-cover bg-center py-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <Card variant="glass" className="w-full max-w-xl p-8 relative z-10 m-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Join Campus Connect</h2>
          <p className="text-gray-500 mt-2">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value, department: [] })}
                className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>



          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          {formData.role === 'student' && (
            <Input
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 21567A0501"
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@gmail.com"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {departments.map((dept) => (
                <label key={dept} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type={formData.role === 'student' ? "radio" : "checkbox"}
                    name="department"
                    value={dept}
                    checked={formData.department.includes(dept)}
                    onChange={handleDepartmentChange}
                    className="text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">Login</Link>
        </div>
      </Card>
    </div >
  );
};

export default Register;
