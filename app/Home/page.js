import React from 'react';
import Image from 'next/image';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import SignIn from '../components/signin/page';
import CampaignManager from '../CampaignManager/page';

const Home = async () => {
    const session = await auth();

    if (!session) {
        redirect('/');
    }

    const { name, email } = session.user;

    const saveCustomerData = async (name, email) => {
        try {
            const response = await fetch(`http://localhost:3000/api/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                console.error('Response not ok:', response.status, response.statusText);
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error saving customer data:', error);
        }
    };


    saveCustomerData(name, email);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <a href="/" className="flex items-center">
                        <Image
                            src="https://cdn.prod.website-files.com/620353a026ae70e21288308a/6536204e44d00a50cb63e6a4_Vector.svg"
                            alt="Xeno"
                            width={120}
                            height={40}
                            className="h-8"
                        />
                    </a>
                    <div className="hidden md:flex space-x-6">
                        <a href="#platform" className="text-gray-600 hover:text-blue-600 transition">
                            Platform
                        </a>
                        <a href="#success" className="text-gray-600 hover:text-blue-600 transition">
                            Success
                        </a>
                        <a href="#resources" className="text-gray-600 hover:text-blue-600 transition">
                            Resources
                        </a>
                        <a href="#careers" className="text-gray-600 hover:text-blue-600 transition">
                            Careers
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <SignIn />
                        <a
                            href="#get-started"
                            className="hidden md:block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
                        >
                            Get Started
                        </a>
                    </div>
                </nav>
            </header>
            <main className="mt-20 flex-1">
                <CampaignManager />
            </main>
        </div>
    );
};

export default Home;