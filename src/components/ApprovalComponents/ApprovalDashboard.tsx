import React, { useEffect } from 'react'
import { ClaimRequest } from '../../types/ClaimRequest'
import { Card } from 'antd'
import Icons from '../icon'
import { searchApprovalClaims } from '../../services/approvalService';


const ApprovalDashboard: React.FC = () => {
    const [claimData, setClaimData] = React.useState<ClaimRequest[]>([]);
    const fetchClaimData = async () => {
        try {
            const response = await searchApprovalClaims({
                searchCondition: {
                    keyword: "",
                    claim_status: "",
                    claim_start_date: "",
                    claim_end_date: "",
                    is_delete: false,
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                },
            });
            setClaimData(response.data.pageData);
            return response.data.pageData;
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchClaimData();
    }, []);

    const statusCounts = React.useMemo(() => {
        return claimData.reduce((acc, request) => {
            acc[request.claim_status] = (acc[request.claim_status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [claimData]);

    return (
            <div className='inline-flex justify-between w-full flex-nowrap gap-4'>
                {['Pending Approval', 'Approved', 'Rejected', 'Cancelled'].map((status) => (
                    <Card
                        key={status}
                        title={<span className='text-white lg:text-xl '>{status} Requests</span>}
                        variant="borderless"
                        className={`!bg-gradient-to-t ${status === 'Approved' ? 'from-[#ffe0cd] to-[#ff9f63]' :
                            status === 'Rejected' ? 'from-[#ffcdcd] to-[#fd3762]' :
                                status === 'Cancelled' ? 'from-[#cdfffb] to-[#63c1ff]' :
                                    status === 'Pending Approval' ? 'from-[#ffffff] to-[#6e6e6e]' : 'from-[#ffffff] to-[#6e6e6e]'} !text-white flex-1 min-w-[200px]`}>
                        <div className='flex justify-between'>
                            <div className='flex flex-col justify-center'>
                                <span className='text-2xl mb-4 font-semibold'>
                                    {statusCounts[status] !== undefined ? statusCounts[status] : 0}
                                </span>
                                <a className={`font-semibold ${status === 'Approved' ? '!text-[#ff914d]' : status === 'Rejected' ? '!text-[#ff0000]' : status === 'Cancelled' ? '!text-[#4d6eff]' : '!text-[#6b3b1c]'} text-xl hover:!text-[#ff914da9]`} href="#">View all</a>
                            </div>
                            <div>
                                {status === 'Approved' && <Icons.FormIcon className='lg:w-20 w-12 h-auto text-[#ff914d]' />}
                                {status === 'Rejected' && <Icons.Cancel className='lg:w-20 w-12 h-auto text-[#ff0037e5]' />}
                                {status === 'Cancelled' && <Icons.Return className='lg:w-20 w-12 h-auto text-[#4d94ff]' />}
                                {status === 'Pending Approval' && <Icons.Pending className='lg:w-20 w-12 h-auto text-gray-400' />}
                                {/* {status === 'Draft' && <Icons.Pending className='lg:w-20 w-12 h-auto text-gray-400' />} */}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
    )
}

export default ApprovalDashboard
