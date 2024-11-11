import { NextResponse } from 'next/server';
import { Customer } from '@/models/Customer';
import connectDB from '@/lib/db';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const customer = await Customer.create(data);
        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const customers = await Customer.find({});
        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}