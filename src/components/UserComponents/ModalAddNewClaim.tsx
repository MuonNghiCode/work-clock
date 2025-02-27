import React, { useState } from 'react';
import { Modal, Form, Input, Space, DatePicker, Select } from 'antd';
import { ClaimRequest } from '../../types/ClaimRequest';

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
        staffName: '',
        staffRole: '',
        staffId: '',
        additionalRemarks: '',
        auditTrail: '',
        dateCreate: '',
        status: 'Draft',
        projectName: '',
        roleInProject: '',
        projectDuration: '',
        totalWorkingHour: 0,
        date: new Date,
        day: '',
        from: '',
        to: '',
        totalNoOfHours: 0,
        remarks: ''
    });

    const handleClaimRequestDataChange = (key: keyof ClaimRequest, value: any) => {
        setClaimRequestData((prevData) => ({
            ...prevData,
            [key]: value,
            ...(key === 'from' && { from: value.toISOString() }),
            ...(key === 'to' && { to: value.toISOString() })
        }));
    };


    const onFinish = () => {
        console.log(claimRequestData);
    };

    return (
        <Modal
            title="Add New Claim Request"
            open={isOpen}
            onOk={onFinish}
            okText='Submit Claim Request'
            onCancel={onClose}
            className=' lg:!w-5/12 md:!w-full !font-squanda !w-full '
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                autoComplete="on"
                size='large'
                initialValues={{ claimRequestData }}
            >
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
                <Form.Item label={<strong>Approval Name</strong>}>
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
                        onChange={(e) => handleClaimRequestDataChange('roleInProject', e.target.value)}
                    />
                </Form.Item>
                <Space direction='horizontal' size='large' className='!w-full justify-between !flex-wrap'>
                    <Form.Item label="From" name='from'>
                        {/* <TimePicker
                            className='!w-full max-w-full'
                            format="HH:mm"
                            value={dayjs(claimRequestData.from, 'HH:mm')}
                            onChange={(time) => handleClaimRequestDataChange('from', time)}
                        /> */}
                        <DatePicker
                            showTime
                            format={'DD-MM-YYYY - HH:mm'}
                            onChange={(value) => handleClaimRequestDataChange('from', value)}
                        />
                    </Form.Item>
                    <Form.Item label="To" name='to'>
                        <DatePicker
                            showTime
                            format={'DD-MM-YYYY - HH:mm'}
                            onChange={(value) => handleClaimRequestDataChange('to', value)}
                        />
                    </Form.Item>
                    <Form.Item label={<strong>Total Working Hours</strong>}>
                        <Input
                            type='number'
                            value={claimRequestData.totalWorkingHour}
                            onChange={(e) => handleClaimRequestDataChange('totalWorkingHour', Number(e.target.value))}
                        />
                    </Form.Item>
                </Space>
                <Form.Item label={<strong>Remarks</strong>} name="additionalRemarks">
                    <Input.TextArea
                        value={claimRequestData.additionalRemarks}
                        onChange={(e) => handleClaimRequestDataChange('additionalRemarks', e.target.value)}
                    />
                </Form.Item>
            </Form >
        </Modal >
    );
};

export default ModalAddNewClaim;