import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }]
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);