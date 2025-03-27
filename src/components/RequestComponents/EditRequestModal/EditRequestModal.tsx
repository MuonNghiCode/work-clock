import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getClaimDetail, updateClaim } from '../../../services/claimService';
import { ResponseModel } from '../../../models/ResponseModel';
import { ClaimItem } from '../../../types/ClaimType';
import { Form, Input, DatePicker, TimePicker, Button, Modal } from 'antd';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);

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
      const initial = {
        claimname: editingRecord.claimname || '',
        startDate: editingRecord.start_date ? dayjs(formatDateForInput(editingRecord.start_date)) : null,
        startTime: editingRecord.timeFrom ? dayjs(editingRecord.timeFrom, 'HH:mm') : null,
        endDate: editingRecord.end_date ? dayjs(formatDateForInput(editingRecord.end_date)) : null,
        endTime: editingRecord.timeTo ? dayjs(editingRecord.timeTo, 'HH:mm') : null,
        totalHours: editingRecord.totalHours || '',
      };
      form.setFieldsValue(initial);
      setInitialValues(initial);
      setHasChanges(false);
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
    if (hasChanges) {
      Modal.confirm({
        title: 'Are you sure you want to exit?',
        content: 'Your changes will not be saved.',
        okText: 'Yes',
        cancelText: 'No',
        okButtonProps: {
          style: {
            backgroundColor: '#FF9447',
            borderColor: '#FF9447',
            color: '#FFFFFF',
            borderRadius: '6px',
            padding: '4px 16px',
            fontWeight: 400,
          },
        },
        cancelButtonProps: {
          style: {
            backgroundColor: '#F3F4F6',
            borderColor: 'transparent',
            color: '#4B5563',
            borderRadius: '6px',
            padding: '4px 16px',
            fontWeight: 400,
          },
        },
        onOk: () => {
          setIsAnimating(false);
          setTimeout(() => onCancel(), 300);
        },
      });
    } else {
      setIsAnimating(false);
      setTimeout(() => onCancel(), 300);
    }
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

      const response = await updateClaim(claimId, updatedClaim, false);
      if (response.success) {
        await onOk();
        toast.success('Claim request updated successfully');
        refreshData();
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
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

  const handleValuesChange = (_: any, allValues: any) => {
    if (!initialValues) return;

    const hasDiff = Object.keys(allValues).some(key => {
      const initial = initialValues[key];
      const current = allValues[key];

      if (dayjs.isDayjs(initial) && dayjs.isDayjs(current)) {
        return !initial.isSame(current);
      }
      return initial !== current;
    });

    setHasChanges(hasDiff);
  };

  if (!isVisible) return null;

  return (
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
            onValuesChange={handleValuesChange}
            layout="vertical"
            disabled={loading}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Claim Details</h3>
                <div className="space-y-4">
                  <Form.Item
                    name="claimname"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">Claim Name</span>}
                    rules={[{ required: true, message: 'Please enter claim name' }]}
                  >
                    <Input
                      className="rounded-md py-2 w-full"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Enter claim name"
                    />
                  </Form.Item>
                  <Form.Item
                    name="totalHours"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">Total Hours</span>}
                    rules={[{ required: true, message: 'Please enter total hours' }]}
                  >
                    <Input
                      className="rounded-md py-2 w-full"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Enter total hours"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Time Details</h3>
                <div className="space-y-4">
                  <Form.Item
                    name="startDate"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">Start Date</span>}
                    rules={[{ required: true, message: 'Please select start date' }]}
                  >
                    <DatePicker
                      className="rounded-md py-2 w-full"
                      format="YYYY-MM-DD"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Select start date"
                    />
                  </Form.Item>
                  <Form.Item
                    name="endDate"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">End Date</span>}
                    rules={[{ required: true, message: 'Please select end date' }]}
                  >
                    <DatePicker
                      className="rounded-md py-2 w-full"
                      format="YYYY-MM-DD"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Select end date"
                    />
                  </Form.Item>
                  <Form.Item
                    name="startTime"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">Start Time</span>}
                    rules={[{ required: true, message: 'Please select start time' }]}
                  >
                    <TimePicker
                      className="rounded-md py-2 w-full"
                      format="HH:mm"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Select start time"
                    />
                  </Form.Item>
                  <Form.Item
                    name="endTime"
                    label={<span className="text-gray-700 text-sm font-['Squada One']">End Time</span>}
                    rules={[{ required: true, message: 'Please select end time' }]}
                  >
                    <TimePicker
                      className="rounded-md py-2 w-full"
                      format="HH:mm"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#374151',
                      }}
                      placeholder="Select end time"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={handleClose}
                className="px-4 py-2 rounded-md"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  fontWeight: 400,
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={`px-4 py-2 rounded-md ${!hasChanges || loading ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: '#FF9447',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 400,
                  opacity: !hasChanges || loading ? 0.5 : 1,
                  cursor: !hasChanges || loading ? 'not-allowed' : 'pointer'
                }}
                loading={loading}
                disabled={!hasChanges || loading}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditRequestModal;