import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Home = async () => {
    const session = await auth(); // Ensure `auth()` is awaited

    if (!session) {
        redirect('/'); // Redirect to the '/' page if not authenticated
    }

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
};

export default Home;
