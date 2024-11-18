'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Fixed import statement

const CampaignManager = () => {
    const [conditions, setConditions] = useState([]);
    const [messageTemplate, setMessageTemplate] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch('/api/campaigns');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch campaigns');
            setCampaigns(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addCondition = () => {
        setConditions([...conditions, { field: '', operator: '', value: '', logicOperator: 'AND' }]);
    };

    const removeCondition = (index) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    const handleConditionChange = (index, field, value) => {
        const updatedConditions = conditions.map((condition, i) =>
            i === index ? { ...condition, [field]: value } : condition
        );
        setConditions(updatedConditions);
    };

    const createCampaign = async () => {
        if (!messageTemplate || conditions.length === 0 ||
            conditions.some(cond => !cond.field || !cond.operator || !cond.value)) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(`https://xeno-task.vercel.app/api/campaigns`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `Campaign - ${new Date().toLocaleDateString()}`,
                    segmentConditions: conditions,
                    messageTemplate,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const { campaign } = await response.json();
            setCampaigns(prev => [campaign, ...(prev || [])]);
            setConditions([]);
            setMessageTemplate('');
            alert('Campaign created successfully!');
            window.location.reload();
        } catch (error) {
            console.log(`Failed to create campaign: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Campaign Manager</h1>

                    <div className="space-y-6">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4">
                                <select
                                    value={condition.field}
                                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                    className="flex-1 p-2 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Field</option>
                                    <option value="totalSpending">Total Spending</option>
                                    <option value="visitCount">Visit Count</option>
                                    <option value="lastVisit">Last Visit</option>
                                </select>

                                <select
                                    value={condition.operator}
                                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                    className="flex-1 p-2 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Operator</option>
                                    <option value=">">Greater Than</option>
                                    <option value="<=">Less Than or Equal</option>
                                    <option value="notVisitedInMonths">Not Visited In Months</option>
                                </select>

                                <input
                                    type="text"
                                    value={condition.value}
                                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 p-2 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />

                                {index < conditions.length - 1 && (
                                    <select
                                        value={condition.logicOperator}
                                        onChange={(e) => handleConditionChange(index, 'logicOperator', e.target.value)}
                                        className="flex-1 p-2 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                    </select>
                                )}

                                <button
                                    onClick={() => removeCondition(index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="flex gap-4">
                            <button
                                onClick={addCondition}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Condition
                            </button>

                            <button
                                onClick={createCampaign}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Create Campaign
                            </button>
                        </div>

                        <textarea
                            value={messageTemplate}
                            onChange={(e) => setMessageTemplate(e.target.value)}
                            placeholder="Enter message template (use [Name] for personalization)"
                            className="w-full p-4 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-32"
                        />
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaigns</h2>
                        <div className="space-x-6">
                            {campaigns?.length > 0 ? (
                                campaigns.map((campaign, index) => (
                                    <Link
                                        href={`/Home/${campaign._id}`}
                                        key={index}
                                    >
                                        <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                                <h3 className="text-xl font-semibold">{campaign.name}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                        Sent: {campaign.deliveryStats?.sent || 0}
                                                    </span>
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                        Failed: {campaign.deliveryStats?.failed || 0}
                                                    </span>
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                        Pending: {campaign.deliveryStats?.pending || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mb-4">
                                                Message: {campaign.messageTemplate}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <p className="font-medium">Conditions:</p>
                                                {campaign.segmentConditions?.map((condition, idx) => (
                                                    <p key={idx} className="ml-4 text-gray-600">
                                                        {condition.field} {condition.operator} {condition.value}
                                                        {condition.logicOperator !== 'AND' && ` (${condition.logicOperator})`}
                                                    </p>
                                                ))}
                                            </div>

                                            <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
                                                <p>Audience: {campaign.audienceSize}</p>
                                                <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">No campaigns available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignManager;