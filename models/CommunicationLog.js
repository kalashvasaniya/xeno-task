import mongoose from 'mongoose';

const CommunicationLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
    message: String,
    sentAt: Date,
    updatedAt: Date
});

export const CommunicationLog = mongoose.models.CommunicationLog || mongoose.model('CommunicationLog', CommunicationLogSchema);