import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    customerIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    segmentConditions: [{
        field: String,
        operator: String,
        value: { type: Number, default: 0 },
        logicOperator: { type: String, enum: ['AND', 'OR'], default: 'AND' }
    }],
    messageTemplate: { type: String, required: true },
    audienceSize: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
