import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Icons from '../icon';
import { ClaimRequest } from '../../types/ClaimRequest';

interface DataProps {
    claimData: ClaimRequest[];
}
const fadeInScaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    bgColor: string;
    textColor: string;
    onClick: () => void;
}
const StatCard = ({
    icon,
    label,
    value,
    bgColor,
    textColor,
    onClick
}: StatCardProps) => (
    <motion.div
        variants={fadeInScaleUp}
        initial="hidden"
        animate="visible"
        onClick={onClick}
        className={`rounded-2xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300`}
    >
        {icon && (
            <div className="p-2 rounded-full bg-white bg-opacity-30">{icon}</div>
        )}
        <p className={`text-xl font-medium ${textColor}`}>{label}</p>
        <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
    </motion.div>
);

const ApprovalDashboard: React.FC<DataProps> = ({ claimData }) => {
    const navigate = useNavigate();
    const data: ClaimRequest[] = claimData;
    const statusCounts = React.useMemo(() => {
        return data.reduce((acc, request) => {
            acc[request.claim_status] = (acc[request.claim_status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [claimData]);

    const handleViewAll = (status: string) => {
        navigate(`/approval/table-approval?status=${status}`);
    };

    return (
        <div className='inline-flex flex-wrap justify-between w-full gap-2'>
            {['Pending Approval', 'Approved', 'Rejected'].map((status) => (
                <StatCard
                    onClick={() => handleViewAll(status)}
                    key={status}
                    icon={status === 'Approved' ? <Icons.FormIcon className="text-3xl text-blue-600 w-12 h-12" /> : status === 'Rejected' ? <Icons.Cancel className="text-3xl text-red-600 w-12 h-12" /> : <Icons.Pending className="text-3xl text-gray-400 w-12 h-12" />}
                    label={status}
                    value={statusCounts[status] !== undefined ? statusCounts[status] : 0}
                    bgColor={`!bg-gradient-to-t ${status === 'Approved' ? 'from-[#d1ffcd67] to-[#22ce00]' :
                        status === 'Rejected' ? 'from-[#ffcdcd] to-[#fd3762]' :
                            status === 'Pending Approval' ? 'from-[#ffffff] to-[#6e6e6e]' : 'from-[#ffffff] to-[#6e6e6e]'} !text-white flex-1 min-w-[200px] py-5`}
                    textColor="text-black-900 font-bold"
                />
            ))}
        </div>
    );
};

export default ApprovalDashboard;
