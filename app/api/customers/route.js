// src/app/api/customers/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Customer from '../../../models/Customer';

export async function POST(req) {
    try {
        // Connect to the database
        await connectDB();

        // Parse the request body
        const { name, email } = await req.json();
        console.log('Creating customer2:', name, email);

        // Check if the customer already exists by email
        let customer = await Customer.findOne({ email: email });

        if (!customer) {
            // Create a new customer if not found
            customer = new Customer({
                name: name,
                email: email,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await customer.save();
            console.log('Customer created successfully:', customer);
        } else {
            console.log('Customer already exists:', customer);
        }

        // Respond with success
        return NextResponse.json({ success: true, customer });

    } catch (error) {
        console.error('Error in customer creation:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
