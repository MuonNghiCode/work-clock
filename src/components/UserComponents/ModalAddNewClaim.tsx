import React, { useState } from 'react';
import { Modal, Button, Form, Input, Space, TimePicker, DatePicker, Select, Row, Col } from 'antd';
import { ClaimRequest, ClaimTableItem } from '../../types/ClaimRequest';
import dayjs from 'dayjs';
import Icons from '../icon';

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
    const [claimRequestData, setClaimRequestData] = useState<ClaimRequest>({
        staffName: '',
        staffRole: '',
        staffId: '',
        additionalRemarks: '',
        auditTrail: '',
        dateCreate: new Date(),
        status: 'Pending',
        projectName: '',
        roleInProject: '',
        projectDuration: '',
        totalWorkingHour: 0,
        claimTable: [{
            date: new Date(),
            day: '',
            from: '',
            to: '',
            totalNoOfHours: 0,
            remarks: ''
        }]
    });

    const handleClaimRequestDataChange = (key: keyof ClaimRequest, value: any) => {
        setClaimRequestData({
            ...claimRequestData,
            [key]: value
        });
    };

    const handleClaimTableChange = (index: number, key: keyof ClaimTableItem, value: any) => {
        const updatedClaimTable = claimRequestData.claimTable.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [key]: value };
                if (key === 'from' || key === 'to') {
                    const fromTime = dayjs(updatedItem.from, 'HH:mm');
                    const toTime = dayjs(updatedItem.to, 'HH:mm');
                    const totalNoOfHours = toTime.diff(fromTime, 'hour', true);
                    updatedItem.totalNoOfHours = totalNoOfHours;
                }
                return updatedItem;
            }
            return item;
        });

        setClaimRequestData({
            ...claimRequestData,
            claimTable: updatedClaimTable
        });
    };

    const [form] = Form.useForm();

    const onFinish = () => {
        console.log(claimRequestData);
        onClose();
    };

    return (
        <Modal
            title="Add New Claim Request"
            open={isOpen}
            onOk={onFinish}
            okText='Submit Claim Request'
            onCancel={onClose}
            className=' !w-6/12 !font-squanda'
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                autoComplete="on"
                size='large'
                initialValues={{ claimRequestData }}
            >
                <Row className='w-full justify-between'>
                    <Col className='w-5/11'>
                        <Form.Item label={<strong>Date Created</strong>}>
                            <Input
                                value={new Date().toISOString()}
                                disabled
                            />
                        </Form.Item >
                    </Col>
                    <Col className='w-5/11'>
                        <Form.Item label={<strong>Claimer Name</strong>}>
                            <Input
                                value={claimRequestData.staffName}
                                onChange={(e) => handleClaimRequestDataChange('staffName', e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
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
                <Row className='w-full justify-between flex-wrap'>
                    <Col className='w-5/11'>
                        <Form.Item label={<strong>Role in Project</strong>}>
                            <Input
                                className='!min-w-80 max-w-full'
                                value={claimRequestData.roleInProject}
                                onChange={(e) => handleClaimRequestDataChange('roleInProject', e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col className='w-5/11'>
                        <Form.Item label={<strong>Project Duration</strong>} >
                            <Input
                                className='!min-w-80 max-w-full'
                                value={claimRequestData.projectDuration}
                                onChange={(e) => handleClaimRequestDataChange('projectDuration', e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={<strong>Additional Remarks</strong>}>
                    <Input.TextArea
                        value={claimRequestData.additionalRemarks}
                        onChange={(e) => handleClaimRequestDataChange('additionalRemarks', e.target.value)}
                    />
                </Form.Item >
                <Form.Item label={<strong>Claim Table</strong>}>
                    <Form.List name="claimTable">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Space key={field.key} className='!w-full flex flex-col items-start border-2 border-gray-300 p-3 m-2 rounded-2xl'>
                                        <Space className='flex-wrap lg:flex !w-full !justify-between'>
                                            <Form.Item className='flex' label="Date" name={[field.name, 'date']}>
                                                <DatePicker
                                                    className='!min-w-40 max-w-full'
                                                    value={dayjs(claimRequestData.claimTable[index]?.date)}
                                                    onChange={(date) => handleClaimTableChange(index, 'date', date?.toDate() || new Date())}
                                                />
                                            </Form.Item>
                                            <Form.Item className='flex' label="Day" name={[field.name, 'day']}>
                                                <Select
                                                    className='!min-w-40 max-w-full'
                                                    value={claimRequestData.claimTable[index]?.day}
                                                    onChange={(value) => handleClaimTableChange(index, 'day', value)}
                                                >
                                                    <Select.Option value="Monday">Monday</Select.Option>
                                                    <Select.Option value="Tuesday">Tuesday</Select.Option>
                                                    <Select.Option value="Wednesday">Wednesday</Select.Option>
                                                    <Select.Option value="Thursday">Thursday</Select.Option>
                                                    <Select.Option value="Friday">Friday</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item className='flex' label="Remarks" name={[field.name, 'remarks']}>
                                                <Input
                                                    className='!min-w-40 max-w-full'
                                                    value={claimRequestData.claimTable[index]?.remarks}
                                                    onChange={(e) => handleClaimTableChange(index, 'remarks', e.target.value)}
                                                />
                                            </Form.Item>
                                        </Space>
                                        <Space className='flex !w-full !min-w-[250px] !justify-between flex-wrap lg:flex'>
                                            <Form.Item label="From" name={[field.name, 'from']}>
                                                <TimePicker
                                                    className='!min-w-40 max-w-full'
                                                    format="HH:mm"
                                                    value={dayjs(claimRequestData.claimTable[index]?.from, 'HH:mm')}
                                                    onChange={(time) => handleClaimTableChange(index, 'from', time?.format('HH:mm') || '')}
                                                />
                                            </Form.Item>
                                            <Form.Item label="To" name={[field.name, 'to']}>
                                                <TimePicker
                                                    className='!min-w-32 max-w-full'
                                                    format="HH:mm"
                                                    value={dayjs(claimRequestData.claimTable[index]?.to, 'HH:mm')}
                                                    onChange={(time) => handleClaimTableChange(index, 'to', time?.format('HH:mm') || '')}
                                                />
                                            </Form.Item>
                                            <Form.Item label="Total No of Hours" name={[field.name, 'totalNoOfHours']}>
                                                <Input
                                                    className='!min-w-32 max-w-full'
                                                    type="number"
                                                    value={claimRequestData.claimTable[index]?.totalNoOfHours}
                                                    readOnly
                                                />
                                            </Form.Item>
                                            <div className='flex items-center '>
                                                <Icons.Reject onClick={() => remove(field.name)} strokeWidth={2} className='!w-8 !h-8 lg:!w-12 lg:!h-12 !text-red-800 hover:!text-red-300' />
                                            </div>
                                        </Space>
                                    </Space>
                                ))}
                                <div className='!w-full !flex !justify-start'>
                                    <Button type="primary" onClick={() => add()} block className='!w-50 '>
                                        + Add Claim Table Item
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form.List>
                </Form.Item >
                <Form.Item label={<strong>Total Working Hours</strong>}>
                    <Input
                        type="number"
                        value={claimRequestData.totalWorkingHour}
                        onChange={(e) => handleClaimRequestDataChange('totalWorkingHour', Number(e.target.value))}
                        autoComplete='on'
                    />
                </Form.Item >
            </Form >
        </Modal >
    );
};

export default ModalAddNewClaim;