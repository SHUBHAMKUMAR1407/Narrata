import React, { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate API call or use a real endpoint if available. 
        // For now, consistent with previous "functional" requirement, we'll simulate success.
        try {
            // await api.post('/contact', formData); // If backend has this
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-teal-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-slate-600">Have questions? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left Column: Form */}
                    <div className="bg-teal-50 rounded-3xl p-8 md:p-10 shadow-sm border border-teal-100/50">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white resize-none"
                                    placeholder=""
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 px-6 rounded-full bg-teal-500 text-white font-bold tracking-wide hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/30 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <p className="text-green-600 text-center text-sm font-medium mt-4">Message sent successfully!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-500 text-center text-sm font-medium mt-4">Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:pt-4 space-y-10">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-teal-900 mb-8">Get in Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                        <HiMail className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">contact@narrata.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                        <HiPhone className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                        <HiLocationMarker className="w-5 h-5" />
                                    </div>
                                    <span className="text-lg">123 Story Street, Creative City, ST 12345</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif font-bold text-teal-900 mb-6">Office Hours</h3>
                            <div className="space-y-2 text-slate-600">
                                <p><span className="font-medium text-slate-800">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                                <p><span className="font-medium text-slate-800">Saturday:</span> 10:00 AM - 4:00 PM</p>
                                <p><span className="font-medium text-slate-800">Sunday:</span> Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
