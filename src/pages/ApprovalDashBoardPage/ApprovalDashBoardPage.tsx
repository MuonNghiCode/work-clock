import { ClaimRequest, generateFakeData } from '../../types/ClaimRequest';
import ApprovalChart from '../../components/ApprovalComponents/ApprovalChart';
import ApprovalDashboard from '../../components/ApprovalComponents/ApprovalDashboard';

const data: ClaimRequest[] = generateFakeData();



const ApprovalDashBoardPage = () => {
    return (
        <>
            <h1 className='text-3xl'>Approval Dashboard</h1>
            <div className='lg:w-10/12 w-full mx-auto'>
                <h1 className='font-bold text-xl my-4'>Overall</h1>
                <ApprovalDashboard data={data} />
                <h1 className='font-bold text-xl my-4'>Chart</h1>
                <ApprovalChart data={data} />
            </div>
        </>
    )
}

export default ApprovalDashBoardPage