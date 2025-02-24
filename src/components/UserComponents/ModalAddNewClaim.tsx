import React, { useState } from 'react';
import { Modal, Form, Input, Space, TimePicker, Select } from 'antd';
import { ClaimRequest } from '../../types/ClaimRequest';
import dayjs, { Dayjs } from 'dayjs';

interface ModalAddNewClaimProps {
    isOpen: boolean;
    onClose: () => void;
}

const sampleProject = [
    {
        name: "Watermelon",
        code: "4669",
        date: "2025-06-04",
        status: "Processing",
    },
    {
        name: "Mango",
        code: "4670",
        date: "2025-09-06",
        status: "Pending",
    },
    {
        name: "Grape",
        code: "4671",
        date: "2025-05-27",
        status: "Processing",
    },
    {
        name: "Banana",
        code: "4672",
        date: "2025-12-11",
        status: "Pending",
    },
    {
        name: "Melon",
        code: "4673",
        date: "2025-12-17",
        status: "Complete",
    },
    {
        name: "Orange",
        code: "OR001",
        date: "2025-12-20",
        status: "Processing",

    },
    {
        name: "Apple",
        code: "AP001",
        date: "2025-12-25",
        status: "Complete",

    },
    {
        name: "Lemon",
        code: "LM001",
        date: "2025-12-30",
        status: "Pending",

    },
    {
        name: "Kiwi",
        code: "KW001",
        date: "2026-01-05",
        status: "Processing",

    }];

const ModalAddNewClaim: React.FC<ModalAddNewClaimProps> = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [claimRequestData, setClaimRequestData] = useState<ClaimRequest>({
        from: '',
        to: '',
        totalNoOfHours: 0,
        roleInProject: '',
        totalWorkingHour: 0,
        additionalRemarks: '',
        staffName: '',
        staffRole: '',
        staffId: '',
        projectName: '',
        projectDuration: '',
        auditTrail: '',
        dateCreate: new Date(),
        status: "Pending",
        date: new Date(),
        day: '',
        remarks: '',
    });

    const handleClaimRequestDataChange = (value: string, field: string) => {
        setClaimRequestData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleTimeChange = (time: Dayjs | null, field: string) => {
        if (time) {
            const formattedTime = time.format('HH:mm');
            setClaimRequestData((prevData) => ({
                ...prevData,
                [field]: formattedTime,
            }));
        }
    };

    const onFinish = () => {
        console.log(claimRequestData);
        onClose();
        form.resetFields();
    };

    return (
        <Modal
            title="Add New Claim Request"
            open={isOpen}
            onOk={onFinish}
            okText='Submit Claim Request'
            onCancel={onClose}
            className=' lg:!w-4/12 md:!w-full !font-squanda !w-full '
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                autoComplete="on"
                size='large'
                initialValues={{ claimRequestData }}
            >
                <h2 className='text-xl text-gray-400'>Date Created: {dayjs(claimRequestData.dateCreate.toISOString()).format('DD/MM/YYYY')}</h2>
                <Form.Item label={<strong>Project Name</strong>}>
                    <Select>
                        {sampleProject &&
                            sampleProject.map((project, index) => (
                                <Select.Option key={index} value={project.name}>
                                    {project.name}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item >
                <Form.Item label={<strong>Role in Project</strong>} name="roleInProject">
                    <Input
                        className=''
                        value={claimRequestData.roleInProject}
                        onChange={(e) => handleClaimRequestDataChange(e.target.value, 'roleInProject')}
                    />
                </Form.Item>
                <Form.Item label={<strong>Additional Remarks</strong>} name="additionalRemarks">
                    <Input.TextArea
                        value={claimRequestData.additionalRemarks}
                        onChange={(e) => handleClaimRequestDataChange(e.target.value, 'additionalRemarks')}
                    />
                </Form.Item>
                <Space direction='horizontal' size='large' className='!w-full justify-between !flex-wrap'>
                    <Form.Item label="From" name='from'>
                        <TimePicker
                            className='!w-full max-w-full'
                            format="HH:mm"
                            value={dayjs(claimRequestData.from, 'HH:mm')}
                            onChange={(time) => handleTimeChange(time, 'from')}
                        />
                    </Form.Item>
                    <Form.Item label="To" name='to'>
                        <TimePicker
                            className='!w-full'
                            format="HH:mm"
                            value={dayjs(claimRequestData.to, 'HH:mm')}
                            onChange={(time) => handleTimeChange(time, 'to')}
                        />
                    </Form.Item>


                    <Form.Item label={<strong>Total Working Hours</strong>}>
                        <Input
                            type='number'
                            value={claimRequestData.totalWorkingHour}
                            onChange={(e) => handleClaimRequestDataChange(e.target.value, 'totalWorkingHour')}
                            autoComplete='on'
                        />
                    </Form.Item >
                </Space>
            </Form >
        </Modal >
    );
};

export default ModalAddNewClaim;