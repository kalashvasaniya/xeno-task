import connectDB from '@/lib/db';
import Customer from '@/models/Customer';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'POST') {
        try {
            const { name, email, phone } = req.body;

            if (!name || !email || !phone) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const customer = new Customer({ name, email, phone });
            await customer.save();

            res.status(201).json({ message: 'Customer added successfully', customer });
        } catch (error) {
            console.error('Error adding customer:', error);
            res.status(500).json({ message: 'Failed to add customer', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
