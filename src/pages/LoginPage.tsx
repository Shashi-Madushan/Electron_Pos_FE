import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/UserService';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Package, Lock, User, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

interface FormErrors {
    username?: string
    password?: string
}

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await loginUser(formData.username, formData.password);
            login(response); // This will save the token and user info

            // Redirect based on role
            if (response.userDTO.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
            toast.success('Login successful! Welcome to your POS system.')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            passwordRef.current?.focus();
        }
    };

    const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit(e as any);
        }
    };

    return (
    
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                ></div>
            </div>

            {/* Login Container */}
            <div className="w-full max-w-md relative">
                {/* Main Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">POS</h1>
                        <p className="text-blue-100 text-sm">Stock Management System</p>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
                            <p className="text-gray-600 text-sm">Please sign in to your account</p>
                        </div>

                        <div className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        ref={usernameRef}
                                        onKeyDown={handleUsernameKeyDown}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your username"
                                    />
                                </div>
                                {errors.username && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.username}
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        ref={passwordRef}
                                        onKeyDown={handlePasswordKeyDown}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="mt-2 flex items-center text-sm text-red-600">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-base hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </div>

                        {/* Additional Links */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Need help? Contact your{' '}
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        system administrator
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">System Online</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <p className="text-xs text-gray-500">© 2025 POSSystem. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginPage;
