import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getClaimDetail, updateClaim } from '../../../services/claimService';
import { ResponseModel } from '../../../models/ResponseModel';
import { ClaimItem } from '../../../types/ClaimType';
import { ConfigProvider, Form, Input, DatePicker, TimePicker, Button } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

if (typeof window !== 'undefined') {
  (window as any).dayjs = dayjs;
}

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string;
  end_date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

interface EditRequestModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => Promise<void>;
  editingRecord: ClaimRequest | null;
  claimId: string;
  refreshData: () => void;
}

const EditRequestModal: React.FC<EditRequestModalProps> = ({ isOpen, onCancel, onOk, claimId, editingRecord, refreshData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<ClaimItem | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const formatDateForInput = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const combineDateTime = (date: string, time: dayjs.Dayjs): string | undefined => {
    if (!date || !time) return undefined;
    const dateTime = dayjs(`${date}T${time.format('HH:mm')}`);
    return dateTime.isValid() ? dateTime.toISOString() : undefined;
  };

  useEffect(() => {
    if (isOpen && editingRecord) {
      form.setFieldsValue({
        claimname: editingRecord.claimname || '',
        startDate: editingRecord.start_date ? dayjs(formatDateForInput(editingRecord.start_date)) : null,
        startTime: editingRecord.timeFrom ? dayjs(editingRecord.timeFrom, 'HH:mm') : null,
        endDate: editingRecord.end_date ? dayjs(formatDateForInput(editingRecord.end_date)) : null,
        endTime: editingRecord.timeTo ? dayjs(editingRecord.timeTo, 'HH:mm') : null,
        totalHours: editingRecord.totalHours || '',
      });
    }

    const fetchClaimDetail = async () => {
      if (isOpen && claimId) {
        setLoading(true);
        try {
          const response: ResponseModel<ClaimItem> = await getClaimDetail(claimId);
          if (response.success) {
            setOriginalData(response.data);
          } else {
            toast.error('Failed to load claim details');
          }
        } catch (error) {
          console.error('Error fetching claim details:', error);
          toast.error('Error loading claim details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClaimDetail();
  }, [isOpen, claimId, editingRecord, form]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onCancel(), 300);
  };

  const handleSubmit = async (values: any) => {
    if (loading) return;

    try {
      setLoading(true);
      const updatedClaim: Partial<ClaimItem> = {};

      if (originalData?.project_id) updatedClaim.project_id = originalData.project_id;
      else throw new Error('Missing project_id in original data');

      if (originalData?.approval_id) updatedClaim.approval_id = originalData.approval_id;
      else throw new Error('Missing approval_id in original data');

      if (values.claimname?.trim()) updatedClaim.claim_name = values.claimname;
      else if (originalData?.claim_name) updatedClaim.claim_name = originalData.claim_name;

      const startDateTime = combineDateTime(values.startDate.format('YYYY-MM-DD'), values.startTime);
      if (startDateTime) updatedClaim.claim_start_date = startDateTime;
      else if (originalData?.claim_start_date) updatedClaim.claim_start_date = originalData.claim_start_date;

      const endDateTime = combineDateTime(values.endDate.format('YYYY-MM-DD'), values.endTime);
      if (endDateTime) updatedClaim.claim_end_date = endDateTime;
      else if (originalData?.claim_end_date) updatedClaim.claim_end_date = originalData.claim_end_date;

      if (values.totalHours?.trim()) {
        const totalHours = parseInt(values.totalHours, 10);
        if (!isNaN(totalHours)) updatedClaim.total_work_time = totalHours;
      } else if (originalData?.total_work_time) updatedClaim.total_work_time = originalData.total_work_time;

      if (startDateTime && endDateTime && dayjs(endDateTime).isSameOrBefore(dayjs(startDateTime))) {
        toast.error('End date and time must be after start date and time');
        setLoading(false);
        return;
      }

      if (Object.keys(updatedClaim).length === 0) {
        toast.info('No changes to update');
        setLoading(false);
        return;
      }

      const response = await updateClaim(claimId, updatedClaim);
      if (response.success) {
        await onOk();
        toast.success('Claim request updated successfully');
        refreshData();
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to update claim');
      }
    } catch (error: any) {
      console.error('Failed to update claim request:', error);
      toast.error(error.message || 'Failed to update claim request');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF9447',
          colorText: '#374151', // gray-700 for general text
          colorTextPlaceholder: '#6B7280', // gray-500
          fontSize: 14, // matches text-sm (0.875rem = 14px)
        },
        components: {
          Button: {
            primaryColor: '#FFFFFF',
            defaultBg: '#F3F4F6', // gray-100
            defaultColor: '#4B5563', // gray-600
            defaultHoverBg: '#E5E7EB', // gray-200
            defaultBorderColor: 'transparent',
            fontWeight: 400, // normal weight for buttons
          },
          Input: {
            activeBorderColor: '#FF9447',
            hoverBorderColor: '#FF9447',
          },
          DatePicker: {
            activeBorderColor: '#FF9447',
            hoverBorderColor: '#FF9447',
          },
          Form: {
            labelFontSize: 14, // matches text-sm
            labelColor: '#374151', // gray-700
          },
        },
      }}
    >
      <div className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out" style={{ opacity: isAnimating ? 1 : 0 }}>
        <div className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out" style={{ opacity: isAnimating ? 1 : 0 }} onClick={handleClose}></div>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-4xl p-6 transition-all duration-300 ease-in-out transform" style={{ opacity: isAnimating ? 1 : 0, transform: isAnimating ? 'scale(1)' : 'scale(0.95)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#FF9447]">Edit Claim Request</h2>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              disabled={loading}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Claim Details</h3>
                  <div className="space-y-4">
                    <Form.Item
                      name="claimname"
                      label={<span className="text-gray-700 text-sm font-squadaone">Claim Name</span>}
                      rules={[{ required: true, message: 'Please enter claim name' }]}
                    >
                      <Input className="rounded-md py-2" />
                    </Form.Item>
                    <Form.Item
                      name="totalHours"
                      label={<span className="text-gray-700 text-sm font-squadaone">Total Hours</span>}
                      rules={[{ required: true, message: 'Please enter total hours' }]}
                    >
                      <Input className="rounded-md py-2" />
                    </Form.Item>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Time Details</h3>
                  <div className="space-y-4">
                    <Form.Item
                      name="startDate"
                      label={<span className="text-gray-700 text-sm font-squadaone">Start Date</span>}
                      rules={[{ required: true, message: 'Please select start date' }]}
                    >
                      <DatePicker className="rounded-md py-2" format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                      name="endDate"
                      label={<span className="text-gray-700 text-sm font-squadaone">End Date</span>}
                      rules={[{ required: true, message: 'Please select end date' }]}
                    >
                      <DatePicker className="rounded-md py-2" format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                      name="startTime"
                      label={<span className="text-gray-700 text-sm font-squadaone">Start Time</span>}
                      rules={[{ required: true, message: 'Please select start time' }]}
                    >
                      <TimePicker className="rounded-md py-2" format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                      name="endTime"
                      label={<span className="text-gray-700 text-sm font-squadaone">End Time</span>}
                      rules={[{ required: true, message: 'Please select end time' }]}
                    >
                      <TimePicker className="rounded-md py-2" format="HH:mm" />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-4 py-2 rounded-md hover:!bg-[#FF8347]"
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default EditRequestModal;