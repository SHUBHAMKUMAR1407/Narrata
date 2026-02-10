import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="min-h-screen bg-premium-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-premium-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-premium-text mb-6">
                        About <span className="text-premium-gold">Narrata</span>
                    </h1>
                    <p className="text-xl text-premium-slate max-w-2xl mx-auto leading-relaxed">
                        Where every story finds its voice, and every reader finds their world.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-teal-500/10 border border-teal-100 p-8 md:p-12 mb-12">
                    <div className="prose prose-lg prose-headings:font-serif prose-headings:text-premium-text prose-p:text-premium-slate prose-a:text-premium-gold max-w-none">
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <p className="mb-6">
                            Narrata is a premium storytelling platform designed for writers, thinkers, and dreamers.
                            We believe that stories have the power to connect, inspire, and transform user experiences.
                            Our mission is to provide a serene, distraction-free environment where creativity can flourish.
                        </p>

                        <h3 className="text-2xl font-bold mb-4">Why Narrata?</h3>
                        <ul className="space-y-3 list-none pl-0 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-premium-gold text-xl">✦</span>
                                <span><strong className="text-premium-text">Curated Experience:</strong> A clean, modern interface that puts content first.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-premium-gold text-xl">✦</span>
                                <span><strong className="text-premium-text">Community Driven:</strong> Connect with fellow writers and engage with meaningful stories.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-premium-gold text-xl">✦</span>
                                <span><strong className="text-premium-text">Premium Aesthetics:</strong> Designed to invoke a sense of calm and classic literature.</span>
                            </li>
                        </ul>

                        <h3 className="text-2xl font-bold mb-4">Join Us</h3>
                        <p>
                            Whether you are here to write the next great novel or simply to enjoy a cup of coffee with a good read,
                            Narrata is your home. Start your journey today.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/signup"
                        className="inline-block py-3 px-8 rounded-full bg-gold-gradient text-white font-bold font-serif shadow-lg hover:shadow-xl hover:shadow-premium-gold/20 transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider"
                    >
                        Start Writing
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default About;
