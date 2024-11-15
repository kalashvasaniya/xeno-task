'use client';
import React, { useState, useEffect } from 'react';

const CampaignManager = () => {
    const [conditions, setConditions] = useState([]);
    const [messageTemplate, setMessageTemplate] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const [campaignResponse, customerResponse] = await Promise.all([
                    fetch('/api/campaigns'),
                    fetch('/api/customers'),
                ]);
                const campaignData = await campaignResponse.json();
                const customerData = await customerResponse.json();
                setCampaigns(campaignData);
                setSelectedCampaigns(customerData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCampaigns();
    }, []);

    const addCondition = () => {
        setConditions([...conditions, { field: '', operator: '', value: '', logicOperator: 'AND' }]);
    };

    const removeCondition = (index) => {
        const updatedConditions = [...conditions];
        updatedConditions.splice(index, 1);
        setConditions(updatedConditions);
    };

    const handleConditionChange = (index, field, value) => {
        const updatedConditions = [...conditions];
        updatedConditions[index][field] = value;
        setConditions(updatedConditions);
    };

    const handleCustomerSelection = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedCampaigns(selected);
    };

    const createCampaign = async () => {
        try {
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `Campaign - ${new Date().toLocaleDateString()}`,
                    customerIDs: selectedCampaigns,
                    segmentConditions: conditions,
                    messageTemplate,
                }),
            });
            const newCampaign = await response.json();
            setCampaigns([newCampaign, ...campaigns]);
            setConditions([]);
            setMessageTemplate('');
            setSelectedCampaigns([]);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden mt-8 mx-auto">
                <h1 className="text-4xl font-semibold text-center py-6">Campaign Manager</h1>

                <div className="p-6 space-y-8">
                    <h2 className="text-2xl font-semibold">Create Campaign</h2>
                    <div className="space-y-4">
                        {conditions.map((condition, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                <select
                                    value={condition.field}
                                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                    className="w-full p-3 rounded-lg border bg-gray-50"
                                >
                                    <option value="">Select Field</option>
                                    <option value="totalSpending">Total Spending</option>
                                    <option value="visitCount">Visit Count</option>
                                    <option value="lastVisit">Last Visit</option>
                                </select>

                                <select
                                    value={condition.operator}
                                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                    className="w-full p-3 rounded-lg border bg-gray-50"
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
                                    className="w-full p-3 rounded-lg border bg-gray-50"
                                />

                                {index < conditions.length - 1 && (
                                    <select
                                        value={condition.logicOperator}
                                        onChange={(e) => handleConditionChange(index, 'logicOperator', e.target.value)}
                                        className="w-full p-3 rounded-lg border bg-gray-50"
                                    >
                                        <option value="AND">AND</option>
                                        <option value="OR">OR</option>
                                    </select>
                                )}

                                <button
                                    onClick={() => removeCondition(index)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addCondition}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                        >
                            Add Condition
                        </button>

                        <textarea
                            value={messageTemplate}
                            onChange={(e) => setMessageTemplate(e.target.value)}
                            placeholder="Enter message template"
                            className="w-full mt-4 p-4 rounded-lg border bg-gray-50"
                        />

                        <button
                            onClick={createCampaign}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto"
                        >
                            Create Campaign
                        </button>
                    </div>
                </div>

                <div className="p-6 mt-12">
                    <h2 className="text-2xl font-semibold">Campaigns</h2>
                    <div className="space-y-6 mt-6">
                        {campaigns.length > 0 ? (
                            campaigns.map((campaign, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                                        <h3 className="text-2xl font-semibold text-gray-900 hover:text-indigo-600">{campaign.name}</h3>
                                        <span className="text-sm text-gray-500 bg-indigo-100 py-1 px-3 rounded-full">
                                            {campaign.segmentConditions.length} Conditions
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Message Template: <span className="font-semibold text-gray-700">{campaign.messageTemplate}</span>
                                    </p>

                                    <div className="text-sm text-gray-500 mb-4">
                                        <p className="font-semibold">Conditions:</p>
                                        {campaign.segmentConditions.length > 0 ? (
                                            campaign.segmentConditions.map((condition, idx) => (
                                                <div key={idx} className="ml-4 mb-2">
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">{condition.field}</span>{' '}
                                                        {condition.operator}{' '}
                                                        <span className="font-semibold">{condition.value}</span>{' '}
                                                        {condition.logicOperator !== 'AND' && (
                                                            <span className="text-blue-600">({condition.logicOperator})</span>
                                                        )}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No conditions available</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center">
                                        <p className="text-sm text-gray-500">Audience Size: <span className="font-semibold text-gray-700">{campaign.audienceSize}</span></p>
                                        <p className="text-sm text-gray-500">Created On: <span className="font-semibold text-gray-700">{new Date(campaign.createdAt).toLocaleDateString()}</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No campaigns available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignManager;