import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateEmployee } from "../../../services/userService";
import { toast } from "react-toastify";

interface Employee {
  _id: string;
  user_id: string;
  job_rank: string;
  contract_type: string;
  account: string;
  address: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  department_code: string;
  salary: number;
  start_date: string;
  end_date: string | null;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  isEmbedded?: boolean;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  isEmbedded = false,
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    full_name: "",
    job_rank: "",
    contract_type: "",
    address: "",
    phone: "",
    avatar_url: "",
    department_code: "",
    salary: 0,
    start_date: "",
    end_date: "",
  });

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setModalVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        start_date: formatDate(employee.start_date),
        end_date: formatDate(employee.end_date),
        salary: employee.salary || 0,
      });
    }
  }, [employee]);

  // Handle modal close with animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300); // Match transition duration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (employee) {
        const changedFields: Record<string, unknown> = {};

        Object.keys(formData).forEach((key) => {
          const k = key as keyof typeof formData;
          if (formData[k] !== employee[k]) {
            changedFields[k] = formData[k];
          }
        });

        // Add required fields
        changedFields.user_id = employee.user_id;

        if (Object.keys(changedFields).length > 0) {
          await updateEmployee(
            employee._id,
            changedFields as Partial<Employee>
          );
          toast.success("Employee updated successfully");
          handleClose(); // Use animated close
        } else {
          toast.info("No changes to update");
        }
      }
    } catch (error: unknown) {
      console.error("Failed to update employee:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update employee.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update the render condition
  if (!modalVisible && !isEmbedded) return null;

  // Nếu là embedded thì không cần wrapper modal
  if (isEmbedded) {
    return (
      <form onSubmit={handleSubmit} className="h-[600px] flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name || ""}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar_url || ""}
                    onChange={(e) =>
                      handleInputChange("avatar_url", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Employment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Job Rank
                  </label>
                  <input
                    type="text"
                    value={formData.job_rank || ""}
                    onChange={(e) =>
                      handleInputChange("job_rank", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department_name || ""}
                    onChange={(e) =>
                      handleInputChange("department_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Contract Type
                  </label>
                  <select
                    value={formData.contract_type || ""}
                    onChange={(e) =>
                      handleInputChange("contract_type", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  >
                    <option value="">Select Contract Type</option>
                    <option value="ONE YEAR">One Year</option>
                    <option value="TWO YEAR">Two Year</option>
                    <option value="THREE YEAR">Three Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary || 0}
                    onChange={(e) =>
                      handleInputChange("salary", Number(e.target.value))
                    }
                    min="0"
                    step="1000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Contract Period
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) =>
                      handleInputChange("end_date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-white">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#FF9447] rounded-md hover:bg-[#FF8347] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    );
  }

  // Original modal render for standalone use
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
            <h2 className="text-2xl font-bold text-[#FF9447]">Edit Employee</h2>
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
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name || ""}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      value={formData.avatar_url || ""}
                      onChange={(e) =>
                        handleInputChange("avatar_url", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Employment Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Job Rank
                    </label>
                    <input
                      type="text"
                      value={formData.job_rank || ""}
                      onChange={(e) =>
                        handleInputChange("job_rank", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department_code || ""}
                      onChange={(e) =>
                        handleInputChange("department_code", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Contract Type
                    </label>
                    <select
                      value={formData.contract_type || ""}
                      onChange={(e) =>
                        handleInputChange("contract_type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    >
                      <option value="">Select Contract Type</option>
                      <option value="ONE YEAR">One Year</option>
                      <option value="TWO YEAR">Two Year</option>
                      <option value="THREE YEAR">Three Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      value={formData.salary || 0}
                      onChange={(e) =>
                        handleInputChange("salary", Number(e.target.value))
                      }
                      min="0"
                      step="1000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contract Period
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
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
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-[#FF9447] rounded-md hover:bg-[#FF8347] transition-colors"
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

export default EditEmployeeModal;
