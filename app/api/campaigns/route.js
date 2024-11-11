// src/app/api/campaigns/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Campaign from '@/models/Campaign';
import CommunicationLog from '@/models/CommunicationLog';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        
        // Calculate audience size based on segment conditions
        const audience = await calculateAudience(data.segmentConditions);
        data.audienceSize = audience.length;
        
        const campaign = await Campaign.create(data);
        
        // Create communication logs for each customer in the audience
        const logs = audience.map(customer => ({
            campaignId: campaign._id,
            customerId: customer._id,
            message: data.messageTemplate.replace('[Name]', customer.name)
        }));
        
        await CommunicationLog.insertMany(logs);
        
        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Campaign creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Campaign fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function calculateAudience(conditions) {
    let query = {};
    
    conditions.forEach((condition, index) => {
        const { field, operator, value, logicOperator } = condition;
        
        let fieldQuery = {};
        switch (operator) {
            case '>':
                fieldQuery[field] = { $gt: value };
                break;
            case '<=':
                fieldQuery[field] = { $lte: value };
                break;
            case 'notVisitedInMonths':
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - value);
                fieldQuery.lastVisit = { $lt: monthsAgo };
                break;
        }
        
        if (logicOperator === 'OR' && index > 0) {
            query = { $or: [query, fieldQuery] };
        } else {
            query = { ...query, ...fieldQuery };
        }
    });
    
    return await Customer.find(query);
}