import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import CommunicationLog from '../../../models/CommunicationLog';

export async function GET() {
    try {
        await connectDB();
        const logs = await CommunicationLog.find();
        return NextResponse.json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error('Error fetching communication logs:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch communication logs',
            error: error.message
        }, { status: 500 });
    }
}
