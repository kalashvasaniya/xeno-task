import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    segmentConditions: [{
        field: String,
        operator: String,
        value: mongoose.Schema.Types.Mixed,
        logicOperator: { type: String, enum: ['AND', 'OR'], default: 'AND' }
    }],
    messageTemplate: { type: String, required: true },
    audienceSize: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
export default Campaign;