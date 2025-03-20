import React from 'react';
import { ClaimRequest } from '../../types/ClaimRequest';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataProps {
    data: ClaimRequest[];
}

const ApprovalChart: React.FC<DataProps> = ({ data }) => {
    const statusCounts = data.reduce((acc, request) => {
        acc[request.claim_status] = (acc[request.claim_status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = {
        labels: ['Pending Approval', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Claim Request',
                data: [
                    statusCounts['Pending Approval'] || 0,
                    statusCounts['Approved'] || 0,
                    statusCounts['Rejected'] || 0,
                ],
                backgroundColor: [
                    'rgba(160, 160, 160, 0.6)',
                    'rgba(75, 192, 75, 0.6)',
                    'rgba(192, 75, 75, 0.6)',
                ],
                borderColor: [
                    'rgba(192, 192, 192, 1)',
                    'rgba(75, 192, 75, 1)',
                    'rgba(192, 75, 75, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Bar data={chartData} />
        </div>
    );
};

export default ApprovalChart;