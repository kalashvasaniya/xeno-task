"use client";
import React, { useState, useEffect } from 'react';

const Details = () => {
    const [param, setParam] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [communicationLogs, setCommunicationLogs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const path = window.location.pathname;
        const paramValue = path.split('/').pop();
        setParam(paramValue);

        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCampaigns(),
                    fetchCommunicationLogs(),
                    fetchCustomers()
                ]);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch customers');
            setCustomers(data.customers);
        } catch (error) {
            setError(error.message);
        }
    };

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

    const fetchCommunicationLogs = async () => {
        try {
            const response = await fetch('/api/communicationlog');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch communication logs');
            setCommunicationLogs(data.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c._id === customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    const filteredCampaigns = campaigns.filter(campaign => campaign._id === param);
    const filteredLogs = communicationLogs.filter(log => log.campaignId === param);

    const getStatusStyle = (status) => {
        const statusMap = {
            'sent': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'failed': 'bg-red-500 text-white',
            'pending': 'bg-gray-500 text-white'
        };
        return statusMap[status.toLowerCase()] || 'bg-gray-500 text-white';
    };

    return (
        <>
            <div className="p-4 max-w-4xl mx-auto">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-800 font-semibold">Error</div>
                        <div className="text-red-600">{error}</div>
                    </div>
                )}

                <div className="mb-8 bg-white rounded-lg border shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Campaign Details</h2>
                    </div>
                    <div className="p-6">
                        {filteredCampaigns.length === 0 ? (
                            <div className="text-gray-500">No campaign found</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {filteredCampaigns.map((campaign) => (
                                    <div key={campaign._id} className="p-4 rounded-lg bg-gray-50 border">
                                        <h3 className="font-semibold mb-2">{campaign.name}</h3>
                                        <p className="text-gray-600">Audience Size: {campaign.audienceSize}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Communication Logs</h2>
                    </div>
                    <div className="p-6">
                        {filteredLogs.length === 0 ? (
                            <div className="text-gray-500">No communication logs found for this campaign</div>
                        ) : (
                            <div className="space-y-3">
                                {filteredLogs.map((log) => (
                                    <div key={log._id} className="p-4 rounded-lg border bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(log.status)}`}>
                                                    {log.status}
                                                </span>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {getCustomerName(log.customerId)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{log.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Details;