"use client"
import { useState } from 'react';

const CampaignManager = () => {
    const [conditions, setConditions] = useState([]);
    const [messageTemplate, setMessageTemplate] = useState('');
    const [campaigns, setCampaigns] = useState([]);

    const addCondition = () => {
        setConditions([...conditions, {
            field: '',
            operator: '',
            value: '',
            logicOperator: 'AND'
        }]);
    };

    const handleConditionChange = (index, field, value) => {
        const newConditions = [...conditions];
        newConditions[index][field] = value;
        setConditions(newConditions);
    };

    const createCampaign = async () => {
        try {
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `Campaign ${new Date().toLocaleDateString()}`,
                    segmentConditions: conditions,
                    messageTemplate
                })
            });

            const campaign = await response.json();
            setCampaigns([campaign, ...campaigns]);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Create Campaign</h2>

                    <div className="space-y-4">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex gap-4">
                                <select
                                    value={condition.field}
                                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                    className="w-1/4 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Field</option>
                                    <option value="totalSpending">Total Spending</option>
                                    <option value="visitCount">Visit Count</option>
                                    <option value="lastVisit">Last Visit</option>
                                </select>

                                <select
                                    value={condition.operator}
                                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                    className="w-1/4 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="w-1/4 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                                {index > 0 && (
                                    <select
                                        value={condition.logicOperator}
                                        onChange={(e) => handleConditionChange(index, 'logicOperator', e.target.value)}
                                        className="w-1/4 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                    </select>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={addCondition}
                            className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Add Condition
                        </button>

                        <input
                            value={messageTemplate}
                            onChange={(e) => setMessageTemplate(e.target.value)}
                            placeholder="Message template (use [Name] for personalization)"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        <button
                            onClick={createCampaign}
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Create Campaign
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Campaign History</h2>
                {campaigns.map((campaign) => (
                    <div
                        key={campaign._id}
                        className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{campaign.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Audience Size: {campaign.audienceSize}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(campaign.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignManager;