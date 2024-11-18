## Project Overview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Built as part of the Xeno SDE Internship assignment, this project showcases the creation of a Mini CRM and Campaign Management App.

## Live Deployment
Experience the project live at [https://xeno-task.vercel.app/](https://xeno-task.vercel.app/).

## Assignment Details

This project implements core features including:
- **Data Ingestion API**: Efficient APIs for loading customer and order data into the database.
- **Campaign & Audience Management**: User-friendly interface for audience definition and campaign tracking.
- **Message Sending and Tracking**: Personalized message delivery with status updates.
- **Google Authentication**: Secure login integration.

## Features Implemented

### 1. Data Ingestion API
- Developed APIs to accept and store customer and order data seamlessly.
- Demonstrated functionality using [Postman](https://www.postman.com/) to verify data population in the database.

### 2. Campaign & Audience Management
- **Audience Creation**: Users can create audience segments with flexible conditions (e.g., spending > INR 10,000).
- **Campaign History**: View past campaigns, ordered by the most recent.
- **Google Authentication**: Secure access to the application ensured through integrated authentication.

### 3. Message Sending and Tracking
- **Communication Log**: Audience data is stored in a communications_log table.
- **Message API**: Sends personalized messages (e.g., “Hi [Name], here’s 10% off on your next order!”).
- **Delivery Receipt API**: Tracks and updates the message status (90% SENT, 10% FAILED) in the database.
- **Pub-Sub Model**: Implemented for scalable batch updates.
- **Statistics Display**: Provides insights on audience size, number of messages sent, and failures.

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## API Demonstration
Use [Postman](https://www.postman.com/) for testing the APIs to ensure data ingestion and functionality.

## Authentication
Integrated with Google for secure user authentication and access control.

## Deployment
The project is deployed on [Vercel](https://vercel.com/) for seamless online access. Check out the live demo at [https://xeno-task.vercel.app/](https://xeno-task.vercel.app/).

## Learn More
For more insights into Next.js and related technologies, refer to:
- [Next.js Documentation](https://nextjs.org/docs) for in-depth information.
- [Xeno’s Website](https://www.getxeno.com/) to understand the broader context of the product.

We look forward to your project submission!
