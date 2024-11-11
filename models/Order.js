import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    product: String,
    amount: Number,
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
