import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            // First get the reset token (simulated flow since we are skipping email step)
            const data = await apiService.forgotPassword(email);

            if (data.resetToken) {
                // Determine which token to use
                const token = data.resetToken;

                // Now reset the password immediately using the token
                await apiService.resetPassword(token, password);

                setMessage('Password has been reset successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Could not verify email. Please check and try again.');
            }
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please check your email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
            {/* Decorative Background - Teal Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl shadow-teal-500/5 border border-teal-50 relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                        <LockClosedIcon className="h-8 w-8 text-teal-600 stroke-1" />
                    </div>
                    <h2 className="text-4xl font-bold font-serif text-teal-900 mb-3 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-teal-600/80 text-sm font-medium">
                        Enter your email and a new password to reset your account access.
                    </p>
                </div>

                {message ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center mb-6">
                        {message}
                        <p className="mt-2 text-xs font-medium">Redirecting to login...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-teal-800 mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all font-medium text-base"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-teal-800 mb-2 ml-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all font-medium text-base"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-teal-800 mb-2 ml-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl border border-teal-100 bg-teal-50/30 text-teal-900 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all font-medium text-base"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-4 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-bold tracking-widest uppercase transition-all shadow-lg shadow-teal-500/20 disabled:opacity-70 text-sm"
                                >
                                    {isSubmitting ? 'RESETTING...' : 'RESET PASSWORD'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <Link to="/login" className="text-sm font-bold text-teal-400 hover:text-teal-600 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
