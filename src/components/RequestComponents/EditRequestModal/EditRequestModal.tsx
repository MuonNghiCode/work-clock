import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { getClaimDetail, updateClaim } from '../../../services/claimService';
import { ResponseModel } from '../../../models/ResponseModel';
import { ClaimItem } from '../../../types/ClaimType';

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string; // "DD/MM/YYYY"
  end_date: string;   // "DD/MM/YYYY"
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
  const [formData, setFormData] = useState({
    claimname: '',
    startDate: '', // "YYYY-MM-DD"
    startTime: '',
    endDate: '',   // "YYYY-MM-DD"
    endTime: '',
    totalHours: '',
  });
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<ClaimItem | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const formatDateForInput = (dateString: string): string => {
    const [day, month, year] = dateString.split('/'); // "DD/MM/YYYY"
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // "YYYY-MM-DD"
  };

  const combineDateTime = (date: string, time: string): string | undefined => {
    if (!date) return undefined;
    const dateTimeString = `${date}T${time || '00:00'}`; // date đã ở dạng "YYYY-MM-DD"
    const dateTime = new Date(dateTimeString);
    return isNaN(dateTime.getTime()) ? undefined : dateTime.toISOString();
  };

  useEffect(() => {
    const initializeForm = () => {
      if (isOpen && editingRecord) {
        setFormData({
          claimname: editingRecord.claimname || '',
          startDate: formatDateForInput(editingRecord.start_date || ''),
          startTime: editingRecord.timeFrom || '',
          endDate: formatDateForInput(editingRecord.end_date || ''),
          endTime: editingRecord.timeTo || '',
          totalHours: editingRecord.totalHours || '0',
        });
      }
    };

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

    initializeForm();
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
      console.log('Raw form values:', formData);
      setLoading(true);

      const updatedClaim: Partial<ClaimItem> = {};

      // Always include project_id and approval_id from originalData
      if (originalData?.project_id) {
        updatedClaim.project_id = originalData.project_id;
      } else {
        throw new Error('Missing project_id in original data');
      }
      if (originalData?.approval_id) {
        updatedClaim.approval_id = originalData.approval_id;
      } else {
        throw new Error('Missing approval_id in original data');
      }

      // Claim Name
      if (formData.claimname?.trim()) {
        updatedClaim.claim_name = formData.claimname;
      } else if (originalData?.claim_name) {
        updatedClaim.claim_name = originalData.claim_name;
      }

      // Start Date and Time
      const startDateTime = combineDateTime(formData.startDate, formData.startTime);
      if (startDateTime) {
        updatedClaim.claim_start_date = startDateTime;
      } else if (originalData?.claim_start_date) {
        updatedClaim.claim_start_date = originalData.claim_start_date;
      }

      // End Date and Time
      const endDateTime = combineDateTime(formData.endDate, formData.endTime);
      if (endDateTime) {
        updatedClaim.claim_end_date = endDateTime;
      } else if (originalData?.claim_end_date) {
        updatedClaim.claim_end_date = originalData.claim_end_date;
      }

      // Total Hours
      if (formData.totalHours?.trim()) {
        const totalHours = parseInt(formData.totalHours, 10);
        if (!isNaN(totalHours)) {
          updatedClaim.total_work_time = totalHours;
        }
      } else if (originalData?.total_work_time) {
        updatedClaim.total_work_time = originalData.total_work_time;
      }

      // Validate date range
      if (startDateTime && endDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
        toast.error('End date and time must be after start date and time');
        setLoading(false);
        return;
      }

      console.log('Sending to updateClaim:', JSON.stringify(updatedClaim, null, 2));

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
      if (error.response?.data) {
        console.error('Server response:', error.response.data);
        toast.error(`Failed to update claim: ${error.response.data.message || 'Bad request'}`);
      } else {
        toast.error(error.message || 'Failed to update claim request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out"
         style={{ opacity: isAnimating ? 1 : 0 }}>
      <div className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out"
           style={{ opacity: isAnimating ? 1 : 0 }}
           onClick={handleClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-4xl p-6 transition-all duration-300 ease-in-out transform"
             style={{ 
               opacity: isAnimating ? 1 : 0,
               transform: isAnimating ? 'scale(1)' : 'scale(0.95)'
             }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#FF9447]">Edit Claim Request</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
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
                    <label className="block text-gray-700 text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime || ""}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
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
                    <label className="block text-gray-700 text-sm font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime || ""}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
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
  );
};

export default EditRequestModal;