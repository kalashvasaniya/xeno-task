'use client';
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

            if (!response.ok) {
                throw new Error(`Failed to create campaign: ${response.statusText}`);
            }

            const campaign = await response.json();
            setCampaigns([campaign, ...campaigns]);
            setConditions([]); // Reset form after submission
            setMessageTemplate('');
        } catch (error) {
            console.error('Error creating campaign:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Create Campaign</h2>

                    <div className="space-y-4">
                        {conditions.map((condition, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <select
                                    value={condition.field}
                                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                    className="w-1/5 rounded-md border px-3 py-2"
                                >
                                    <option value="">Select Field</option>
                                    <option value="totalSpending">Total Spending</option>
                                    <option value="visitCount">Visit Count</option>
                                    <option value="lastVisit">Last Visit</option>
                                </select>

                                <select
                                    value={condition.operator}
                                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                    className="w-1/5 rounded-md border px-3 py-2"
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
                                    className="w-1/5 rounded-md border px-3 py-2"
                                />

                                <button
                                    onClick={() => setConditions(conditions.filter((_, i) => i !== index))}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={addCondition} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Add Condition
                    </button>

                    <textarea
                        value={messageTemplate}
                        onChange={(e) => setMessageTemplate(e.target.value)}
                        placeholder="Enter your message template"
                        className="mt-4 w-full rounded-md border p-3"
                    />

                    <button onClick={createCampaign} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                        Create Campaign
                    </button>

                    <h2 className="text-2xl font-semibold mt-6">Campaigns</h2>

                    <div className="space-y-4 mt-4">
                        {campaigns.map((campaign, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold">{campaign.name}</h3>
                                <p className="text-sm text-gray-500">{campaign.segmentConditions.length} conditions</p>
                            </div>
                        ))}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignManager;
