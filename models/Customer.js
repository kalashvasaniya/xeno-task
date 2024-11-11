import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpending: { type: Number, default: 0 },
    lastVisit: { type: Date },
    visitCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);