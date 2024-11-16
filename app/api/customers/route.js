import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Customer from '../../../models/Customer';

export async function GET() {
    try {
        await connectDB();
        const customers = await Customer.find({});
        return NextResponse.json({ success: true, customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { name, email } = await req.json();

        let customer = await Customer.findOne({ email });

        if (!customer) {
            customer = await Customer.create({ name, email, createdAt: new Date(), updatedAt: new Date() });
            console.log('Customer created successfully:', customer);
        } else {
            console.log('Customer already exists:', customer);
        }

        return NextResponse.json({ success: true, customer });
    } catch (error) {
        console.error('Error in customer creation:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
