import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Campaign from '../../../models/Campaign';
import CommunicationLog from '../../../models/CommunicationLog';
import Customer from '../../../models/Customer';

export async function POST(request) {
    try {
        await connectDB();
        const { name, segmentConditions, messageTemplate } = await request.json();

        if (!name || !Array.isArray(segmentConditions) || !messageTemplate) {
            return NextResponse.json(
                { error: 'Invalid request data. Ensure all required fields are provided.' },
                { status: 400 }
            );
        }

        const audience = await calculateAudience(segmentConditions);
        const audienceSize = audience.length;
        const customerIDs = audience.map(customer => customer._id);

        const campaign = await Campaign.create({
            name,
            segmentConditions,
            messageTemplate,
            customerIDs,
            audienceSize,
        });

        const logs = audience.map((customer) => ({
            campaignId: campaign._id,
            customerId: customer._id,
            message: messageTemplate.replace('[Name]', customer.name || 'Customer'),
        }));

        await CommunicationLog.insertMany(logs);
        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Campaign creation error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
        return NextResponse.json(campaigns, { status: 200 });
    } catch (error) {
        console.error('Campaign fetch error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function calculateAudience(conditions) {
    try {
        let query = { $and: [] };
        const orConditions = [];

        conditions.forEach(({ field, operator, value, logicOperator }) => {
            let fieldQuery = {};

            switch (operator) {
                case '>': fieldQuery[field] = { $gt: Number(value) }; break;
                case '<=': fieldQuery[field] = { $lte: Number(value) }; break;
                case 'notVisitedInMonths':
                    const monthsAgo = new Date();
                    monthsAgo.setMonth(monthsAgo.getMonth() - Number(value));
                    fieldQuery.lastVisit = { $lt: monthsAgo };
                    break;
                default: throw new Error(`Unsupported operator: ${operator}`);
            }

            if (logicOperator === 'OR') {
                orConditions.push(fieldQuery);
            } else {
                query.$and.push(fieldQuery);
            }
        });

        if (orConditions.length > 0) {
            query = query.$and.length
                ? { $and: [...query.$and, { $or: orConditions }] }
                : { $or: orConditions };
        }

        return await Customer.find(query);
    } catch (error) {
        console.error('Audience calculation error:', error);
        throw error;
    }
}