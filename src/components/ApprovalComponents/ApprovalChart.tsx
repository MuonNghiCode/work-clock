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
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = {
        labels: ['Approved', 'Rejected', 'Canceled', 'Pending'],
        datasets: [
            {
                label: 'Claim Request',
                data: [
                    statusCounts['Approve'] || 0,
                    statusCounts['Reject'] || 0,
                    statusCounts['Return'] || 0,
                    statusCounts['Pending'] || 0,
                ],
                backgroundColor: [
                    'rgba(75, 192, 75, 0.2)', // green
                    'rgba(192, 75, 75, 0.2)', // red
                    'rgba(75, 75, 192, 0.2)', // blue
                    'rgba(192, 192, 192, 0.2)', // gray
                ],
                borderColor: [
                    'rgba(75, 192, 75, 1)', // green
                    'rgba(192, 75, 75, 1)', // red
                    'rgba(75, 75, 192, 1)', // blue
                    'rgba(192, 192, 192, 1)', // gray
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