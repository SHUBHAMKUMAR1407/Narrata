import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

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
            await apiService.resetPassword(token, password);
            setMessage('Password has been reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Link might be expired.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-premium-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-teal-500/10 relative z-10 border border-teal-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                        <LockClosedIcon className="h-6 w-6 text-premium-gold" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif text-premium-text">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-premium-slate">
                        Your new password must be different to previously used passwords.
                    </p>
                </div>

                {message ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
                        {message}
                        <p className="mt-2 text-xs">Redirecting to login...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-premium-text mb-1">New Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-teal-200 placeholder-gray-400 text-premium-text focus:outline-none focus:ring-premium-gold focus:border-premium-gold sm:text-sm bg-teal-50/30 transition-colors"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-premium-text mb-1">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-teal-200 placeholder-gray-400 text-premium-text focus:outline-none focus:ring-premium-gold focus:border-premium-gold sm:text-sm bg-teal-50/30 transition-colors"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold font-serif rounded-full text-white bg-gold-gradient hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
                                >
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
