import { useState } from 'react'
// import { ClaimRequest } from '../../types/ClaimRequest'
// import { generateFakeData } from '../../types/ClaimRequest'
import { Button } from 'antd';
import ModalAddNewClaim from '../../components/UserComponents/ModalAddNewClaim';

const UserDashboardPage = () => {
    // const data: ClaimRequest[] = generateFakeData();
    const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

    const handleOpenModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(true);
    };
    const handleCloseModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(false);
    };
    return (
        <>
            <h1 className='text-3xl'>User Dashboard</ h1>
            <Button onClick={handleOpenModalAddNewClaim}>Add New Claim</Button>
            <ModalAddNewClaim isOpen={isOpenModalAddNewClaim} onClose={handleCloseModalAddNewClaim} />
        </>
    )
}

export default UserDashboardPage