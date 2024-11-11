import { Order } from '@/models/Order';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        const order = await Order.create(data);

        // Update customer's total spending and visit count
        await Customer.findByIdAndUpdate(data.customerId, {
            $inc: { totalSpending: data.amount, visitCount: 1 },
            $set: { lastVisit: new Date() }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}