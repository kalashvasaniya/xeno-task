import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Customer from '@/models/Customer';

export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'POST') {
        try {
            const { customerId, product, amount } = req.body;
            const customer = await Customer.findById(customerId);
            if (!customer) throw new Error('Customer not found');

            const order = new Order({ customerId, product, amount });
            await order.save();
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
