import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '../../../lib/db';
import Campaign from '../../../models/Campaign';
import CommunicationLog from '../../../models/CommunicationLog';
import Customer from '../../../models/Customer';

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const shouldFail = () => Math.random() < 0.10;

async function sendEmail(customer, messageTemplate, campaignName) {
    if (shouldFail()) return false;

    try {
        const campaignName = '10% off on your next order!';
        const message = `Hi ${customer.name}, here’s 10% off on your next order!`;
        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: [customer.email],
            subject: campaignName,
            text: message
        });
        if (error) throw error;
        return true;
    } catch {
        return false;
    }
}

async function processBatch(batch, messageTemplate, campaignName) {
    const results = [];
    for (const customer of batch) {
        const success = await sendEmail(customer, messageTemplate, campaignName);
        results.push({ customer, success });
        await delay(500);
    }
    return results;
}

async function getAudience(conditions) {
    const query = conditions.reduce((acc, { field, operator, value }) => {
        switch (operator) {
            case '>': return { ...acc, [field]: { $gt: Number(value) } };
            case '<=': return { ...acc, [field]: { $lte: Number(value) } };
            case 'notVisitedInMonths': {
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - Number(value));
                return { ...acc, lastVisit: { $lt: monthsAgo } };
            }
            default: return acc;
        }
    }, {});
    return await Customer.find(query);
}

async function updateCampaignStats(campaignId) {
    const logs = await CommunicationLog.find({ campaignId });
    return {
        totalMessages: logs.length,
        sent: logs.filter(log => log.status === 'SENT').length,
        failed: logs.filter(log => log.status === 'FAILED').length,
        pending: logs.filter(log => log.status === 'PENDING').length
    };
}

async function createCampaignLogs(campaign, audience, messageTemplate) {
    return await CommunicationLog.insertMany(
        audience.map(customer => ({
            campaignId: campaign._id,
            customerId: customer._id,
            message: messageTemplate.replace(/\[Name\]/g, customer.name || 'Customer'),
            status: 'PENDING'
        }))
    );
}

export async function POST(request) {
    try {
        await connectDB();
        const { name, segmentConditions, messageTemplate } = await request.json();
        if (!name || !segmentConditions?.length || !messageTemplate) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const audience = await getAudience(segmentConditions);
        const campaign = await Campaign.create({
            name,
            segmentConditions,
            messageTemplate,
            customerIDs: audience.map(c => c._id),
            audienceSize: audience.length,
            status: 'IN_PROGRESS'
        });

        const logs = await createCampaignLogs(campaign, audience, messageTemplate);
        let [sent, failed] = [0, 0];

        for (let i = 0; i < audience.length; i += 10) {
            const batch = audience.slice(i, i + 10);
            const results = await processBatch(batch, messageTemplate, name);

            await Promise.all(results.map(async ({ customer, success }) => {
                const log = logs.find(l => l.customerId.toString() === customer._id.toString());
                success ? sent++ : failed++;
                await CommunicationLog.findByIdAndUpdate(log._id, {
                    status: success ? 'SENT' : 'FAILED',
                    deliveredAt: success ? new Date() : undefined
                });
            }));

            await Campaign.findByIdAndUpdate(campaign._id, {
                emailsSent: sent,
                emailsFailed: failed,
                lastEmailSentAt: new Date()
            });
        }

        const finalCampaign = await Campaign.findByIdAndUpdate(
            campaign._id,
            { status: 'COMPLETED' },
            { new: true }
        );

        return NextResponse.json({
            campaign: finalCampaign,
            statistics: { totalAudience: audience.length, sent, failed }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        const campaignStats = await Promise.all(
            campaigns.map(async (campaign) => ({
                ...campaign.toObject(),
                deliveryStats: await updateCampaignStats(campaign._id)
            }))
        );
        return NextResponse.json(campaignStats);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}