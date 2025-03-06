import { useState } from 'react';
import { ClaimRequest, generateFakeData } from '../../types/ClaimRequest';
import ApprovalChart from '../../components/ApprovalComponents/ApprovalChart';
import ApprovalDashboard from '../../components/ApprovalComponents/ApprovalDashboard';
import { Button } from 'antd';
import ModalAddNewClaim from '../../components/UserComponents/ModalAddNewClaim';

const data: ClaimRequest[] = generateFakeData();



const ApprovalDashBoardPage = () => {
    const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

    const handleOpenModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(true);
    };
    const handleCloseModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(false);
    };
    return (
        <>
            <h1 className='text-3xl'>Approval Dashboard</h1>
            <div className="w-full flex">
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
                <ApprovalDashboard />
                <h1 className='font-bold text-xl my-4'>Chart</h1>
                <ApprovalChart data={data} />
            </div>
        </>
    )
}

export default ApprovalDashBoardPage