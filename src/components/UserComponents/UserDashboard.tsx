import { useState } from 'react'
import { Button } from 'antd';
import ModalAddNewClaim from './ModalAddNewClaim';

const UserDashboard = () => {
    const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

    const handleOpenModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(true);
    };
    const handleCloseModalAddNewClaim = () => {
        setIsOpenModalAddNewClaim(false);
    };
    return (
        <>
            <Button onClick={handleOpenModalAddNewClaim}>Add New Claim</Button>
            <div> UserDashboard</ div>
            <ModalAddNewClaim isOpen={isOpenModalAddNewClaim} onClose={handleCloseModalAddNewClaim} />
        </>
    )
}

export default UserDashboard