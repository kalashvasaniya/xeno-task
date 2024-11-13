// src/app/api/campaigns/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Campaign from '../../../models/Campaign';
import CommunicationLog from '../../../models/CommunicationLog';
import Customer from '../../../models/Customer'; // Ensure this model is imported for audience queries

// Function to handle POST request for creating a new campaign
export async function POST(request) {
    try {
        // Connect to the database
        await connectDB();

        // Parse request data
        const data = await request.json();

        // Calculate the audience based on segment conditions
        const audience = await calculateAudience(data.segmentConditions);
        data.audienceSize = audience.length;

        // Create a new campaign entry in the database
        const campaign = await Campaign.create(data);

        // Generate communication logs for each member of the audience
        const logs = audience.map(customer => ({
            campaignId: campaign._id,
            customerId: customer._id,
            message: data.messageTemplate.replace('[Name]', customer.name) // Replace placeholder with actual customer name
        }));

        // Insert the generated communication logs into the database
        await CommunicationLog.insertMany(logs);

        // Return the created campaign as the response
        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Campaign creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Function to handle GET request to retrieve all campaigns
export async function GET() {
    try {
        // Connect to the database
        await connectDB();

        // Fetch all campaigns, sorted by creation date (most recent first)
        const campaigns = await Campaign.find({}).sort({ createdAt: -1 });

        // Return the campaigns as a JSON response
        return NextResponse.json(campaigns);
    } catch (error) {
        console.error('Campaign fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper function to calculate the audience based on segment conditions
async function calculateAudience(conditions) {
    let query = {};

    conditions.forEach((condition, index) => {
        const { field, operator, value, logicOperator } = condition;

        let fieldQuery = {};

        // Build field-specific query based on the operator
        switch (operator) {
            case '>':
                fieldQuery[field] = { $gt: Number(value) };
                break;
            case '<=':
                fieldQuery[field] = { $lte: Number(value) };
                break;
            case 'notVisitedInMonths':
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - Number(value));
                fieldQuery.lastVisit = { $lt: monthsAgo };
                break;
            default:
                throw new Error(`Unsupported operator: ${operator}`);
        }

        // Combine conditions with the appropriate logical operator
        if (logicOperator === 'OR' && index > 0) {
            query = { $or: [query, fieldQuery] };
        } else {
            query = { ...query, ...fieldQuery };
        }
    });

    // Query the Customer collection and return the audience
    const audience = await Customer.find(query);
    return audience;
}
