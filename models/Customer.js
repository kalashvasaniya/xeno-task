import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    items: [OrderItemSchema]
});

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    totalSpending: { type: Number, default: 0 },
    lastVisit: { type: Date },
    visitCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    orders: [OrderSchema] // Nested orders schema
});

// Ensure there is no existing model before defining a new one
mongoose.models = {};

export default mongoose.model('Customer', CustomerSchema);
