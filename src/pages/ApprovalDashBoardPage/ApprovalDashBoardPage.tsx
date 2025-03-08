import { useEffect, useState } from 'react';
import ApprovalChart from '../../components/ApprovalComponents/ApprovalChart';
import ApprovalDashboard from '../../components/ApprovalComponents/ApprovalDashboard';
import { Button } from 'antd';
import ModalAddNewClaim from '../../components/UserComponents/ModalAddNewClaim';
import { ClaimRequest } from '../../types/ClaimRequest';
import { searchApprovalClaims } from '../../services/approvalService';


const ApprovalDashBoardPage = () => {
    const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);
    const [claimData, setClaimData] = useState<ClaimRequest[]>([]);
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

    const handleOpenModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(true);
    };
    const handleCloseModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(false);
    };
    return (
        <>
            <h1 className='text-5xl !py-9'>Approval Dashboard</h1>
            <div className="w-full flex py-4">
                <Button
                    className="w-42 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
                    onClick={handleOpenModalAddNewClaim}
                >
                    Add New Claim
                </Button>
            </div>
            {/* <TableUserDashboard data={data} /> */}
            <ModalAddNewClaim
                isOpen={isOpenModalAddNewClaim}
                onClose={handleCloseModalAddNewClaim}
            />
            <div className='lg:w-10/12 w-full mx-auto'>
                <h1 className='font-bold text-xl my-4'>Overall</h1>
                <ApprovalDashboard claimData={claimData} />
                <h1 className='font-bold text-xl my-4'>Chart</h1>
                <ApprovalChart data={claimData} />
            </div>
        </>
    )
}

export default ApprovalDashBoardPage