import React from 'react';
import Image from 'next/image';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import SignIn from '../components/signin/page';

const Home = async () => {
    const session = await auth();

    if (!session) {
        redirect('/');
    }

    return (
        <div>
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                    <div className="w-full h-16 flex justify-between items-center">
                        <a href="/" className="flex-shrink-0">
                            <span className="sr-only">Xeno</span>
                            <Image
                                src="https://cdn.prod.website-files.com/620353a026ae70e21288308a/6536204e44d00a50cb63e6a4_Vector.svg"
                                alt="Xeno"
                                width={120}
                                height={40}
                                priority
                                className="w-auto h-8"
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#platform" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Platform
                            </a>
                            <a href="#success" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Success
                            </a>
                            <a href="#resources" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Resources
                            </a>
                            <a href="#careers" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Careers
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center space-x-4">
                            <SignIn className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors" />
                            <a
                                href="#get-started"
                                className="md:inline-block hidden bg-blue-600 py-2 px-6 text-sm font-medium text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Home;
