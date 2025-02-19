import React from 'react'
import { ClaimRequest } from '../../types/ClaimRequest'
import { Card, Col, Row } from 'antd'
import Icons from '../icon'

interface DataProps {
    data: ClaimRequest[];
}

const ApprovalDashboard: React.FC<DataProps> = ({ data }) => {
    const statusCounts = data.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <>
            <Row gutter={[16, 16]}>
                {statusCounts && (<>
                    <Col xs={24} sm={12} md={6}>
                        <Card title={<span className='text-white lg:text-xl '>Approved Requests</span>} variant="borderless" className='!bg-gradient-to-t from-[#ffe0cd] to-[#ff9f63] !text-white' >
                            <div className='flex justify-between'>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-2xl mb-4 font-semibold'>{statusCounts['Approve']}</span>
                                    <a className='font-semibold !text-[#ff914d] text-xl hover:!text-[#ff914da9]' href="#">View all</a>
                                </div>
                                <div>
                                    <Icons.FormIcon className='lg:w-20 w-12 h-auto text-[#ff914d]' />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title={<span className='text-white lg:text-xl '>Rejected Requests</span>} variant="borderless" className='!bg-gradient-to-t from-[#ffcdcd] to-[#fd3762] !text-white' >
                            <div className='flex justify-between'>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-2xl mb-4 font-semibold'>{statusCounts['Reject']}</span>
                                    <a className='font-semibold !text-[#ff0000] hover:!text-[#f88787] text-xl' href="#">View all</a>
                                </div>
                                <div>
                                    <Icons.Cancel className='lg:w-20 w-12 h-auto text-[#ff0037e5]' />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title={<span className='text-white lg:text-xl '>Returned Requests</span>} variant="borderless" className='!bg-gradient-to-t from-[#cdfffb] to-[#63c1ff] !text-white' >
                            <div className='flex justify-between'>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-2xl mb-4 font-semibold'>{statusCounts['Return']}</span>
                                    <a className='font-semibold !text-[#4d6eff] hover:!text-[#4d6eff93] text-xl' href="#">View all</a>
                                </div>
                                <div>
                                    <Icons.Return className='lg:w-20 w-12 h-auto text-[#4d94ff]' />
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card title={<span className='text-white lg:text-xl '>Pending Requests</span>} variant="borderless" className='!bg-gradient-to-t from-[#ffffff] to-[#6e6e6e] !text-white' >
                            <div className='flex justify-between'>
                                <div className='flex flex-col justify-center'>
                                    <span className='text-2xl mb-4 font-semibold'>{statusCounts['Pending']}</span>
                                    <a className='font-semibold !text-[#6b3b1c] text-xl hover:!text-[#6b3c1c33]' href="#">View all</a>
                                </div>
                                <div>
                                    <Icons.Pending className='lg:w-20 w-12 h-auto text-gray-400' />
                                </div>
                            </div>
                        </Card>
                    </Col>
                </>
                )
                }
            </Row>
        </>
    )
}

export default ApprovalDashboard