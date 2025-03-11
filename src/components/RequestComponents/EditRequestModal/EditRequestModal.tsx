import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getClaimDetail, updateClaim } from '../../../services/claimService';
import { ResponseModel } from '../../../models/ResponseModel';
import { ClaimItem } from '../../../types/ClaimType';
import { ConfigProvider, TimePicker } from 'antd';
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
  start_date: string; // "DD/MM/YYYY"
  end_date: string;   // "DD/MM/YYYY"
  totalHours: string;
  timeFrom: string;   // "HH:mm" (24-hour)
  timeTo: string;     // "HH:mm" (24-hour)
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
  const [formData, setFormData] = useState({
    claimname: '',
    startDate: '',
    startTime: dayjs(),
    endDate: '',
    endTime: dayjs(),
    totalHours: '',
  });
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
      setFormData({
        claimname: editingRecord.claimname || '',
        startDate: formatDateForInput(editingRecord.start_date || ''),
        startTime: editingRecord.timeFrom ? dayjs(editingRecord.timeFrom, 'HH:mm') : dayjs(),
        endDate: formatDateForInput(editingRecord.end_date || ''),
        endTime: editingRecord.timeTo ? dayjs(editingRecord.timeTo, 'HH:mm') : dayjs(),
        totalHours: editingRecord.totalHours || '0',
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
  }, [isOpen, claimId, editingRecord]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const updatedClaim: Partial<ClaimItem> = {};

      if (originalData?.project_id) updatedClaim.project_id = originalData.project_id;
      else throw new Error('Missing project_id in original data');

      if (originalData?.approval_id) updatedClaim.approval_id = originalData.approval_id;
      else throw new Error('Missing approval_id in original data');

      if (formData.claimname?.trim()) updatedClaim.claim_name = formData.claimname;
      else if (originalData?.claim_name) updatedClaim.claim_name = originalData.claim_name;

      const startDateTime = combineDateTime(formData.startDate, formData.startTime);
      if (startDateTime) updatedClaim.claim_start_date = startDateTime;
      else if (originalData?.claim_start_date) updatedClaim.claim_start_date = originalData.claim_start_date;

      const endDateTime = combineDateTime(formData.endDate, formData.endTime);
      if (endDateTime) updatedClaim.claim_end_date = endDateTime;
      else if (originalData?.claim_end_date) updatedClaim.claim_end_date = originalData.claim_end_date;

      if (formData.totalHours?.trim()) {
        const totalHours = parseInt(formData.totalHours, 10);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeChange = (field: string, time: dayjs.Dayjs | null) => {
    setFormData((prev) => ({ ...prev, [field]: time || dayjs() }));
  };

  if (!isVisible) return null;

  return (
    <ConfigProvider>
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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Claim Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Claim Name</label>
                      <input
                        type="text"
                        value={formData.claimname || ""}
                        onChange={(e) => handleInputChange("claimname", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Total Hours</label>
                      <input
                        type="text"
                        value={formData.totalHours || ""}
                        onChange={(e) => handleInputChange("totalHours", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Time Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ""}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Start Time</label>
                      <TimePicker
                        value={formData.startTime}
                        onChange={(time) => handleTimeChange('startTime', time)}
                        format="HH:mm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">End Time</label>
                      <TimePicker
                        value={formData.endTime}
                        onChange={(time) => handleTimeChange('endTime', time)}
                        format="HH:mm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#FF9447] rounded-md hover:bg-[#FF8347] transition-colors"
                  disabled={loading}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default EditRequestModal;