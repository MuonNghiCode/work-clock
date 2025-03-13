import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { updateEmployee } from "../../../services/userService";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosUser";
import ImageUploader from "../../ImageUploader/ImageUploader";
import { EmployeeInfo } from "../../../types/Employee";
import { Form, Input} from "antd";

// export interface Employee {
//   _id: string;
//   user_id: string;
//   job_rank: string;
//   contract_type: string;
//   account: string;
//   address: string;
//   phone: string;
//   full_name: string;
//   avatar_url: string;
//   department_code: string;
//   salary: number;
//   start_date: string | null;
//   end_date: string | null;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   is_deleted: boolean;
// }

export interface Job {
  _id: string;
  job_rank: string;
  job_title: string;
  is_deleted: boolean;
}

interface Department {
  _id: string;
  department_code: string;
  department_name: string;
  description: string;
  is_deleted: boolean;
}

interface Contract {
  _id: string;
  contract_type: string;
  description: string;
  is_deleted: boolean;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeInfo | null;
  isEmbedded?: boolean;
  onUpdateSuccess?: (updatedEmployee: EmployeeInfo) => void;
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
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<EmployeeInfo>>({});
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(formData);

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

  // Initialize formData and previewAvatar with employee data
  useEffect(() => {
    if (employee) {
      console.log("Setting employee data:", employee);
      setFormData({
        user_id: employee.user_id,
        job_rank:employee.job_rank,
        contract_type: employee.contract_type,
        account: employee.account,
        address: employee.address || "",
        phone: employee.phone,
        full_name: employee.full_name,
        avatar_url: employee.avatar_url,
        department_code: employee.department_code,
        salary: employee.salary || 0,
        start_date: formatDate(employee.start_date),
        end_date: formatDate(employee.end_date),
      });
      setPreviewAvatar(employee.avatar_url || ""); // Đồng bộ previewAvatar
    } else {
      console.log("No employee data provided");
    }
  }, [employee]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [jobsRes, deptsRes, contractsRes] = await Promise.all([
          axiosInstance.get("/jobs/get-all"),
          axiosInstance.get("/departments/get-all"),
          axiosInstance.get("/contracts/get-all"),
        ]);

        if (jobsRes.data?.data) setJobs(jobsRes.data.data);
        if (deptsRes.data?.data) setDepartments(deptsRes.data.data);
        if (contractsRes.data?.data) setContracts(contractsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load form data");
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  // Handle modal close with animation
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee?.user_id) {
      console.log("Current employee:", employee);
      toast.error("No employee data available");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: EmployeeInfo = {
        ...formData,
        user_id: formData.user_id || "",
        job_rank: formData.job_rank || "",
        contract_type: formData.contract_type || "",
        account: formData.account || "",
        address: formData.address || "",
        phone: formData.phone || "",
        full_name: formData.full_name || "",
        avatar_url: formData.avatar_url || "",
        department_code: formData.department_code || "",
        department_name: formData.department_name || "",
        salary: Number(formData.salary) || 0,
        start_date: formData.start_date || "",
        end_date: formData.end_date || null,
        updated_by: employee?.updated_by || "",
        // created_at: employee?.created_at || "",
        // updated_at: new Date(Date.now()),
        is_deleted: employee?.is_deleted || false,
      };

      await updateEmployee(employee.user_id, updateData);
      toast.success("Employee updated successfully");
      onUpdateSuccess?.(updateData);
      onClose();
    } catch (error) {
      console.error("Failed to update employee:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update employee"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof EmployeeInfo, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateImageUrl = async (url: string) => {
    try {
      const img = new Image();
      img.onload = () => {
        setPreviewAvatar(url);
        setFormData((prev) => ({ ...prev, avatar_url: url }));
      };
      img.onerror = () => {
        setPreviewAvatar("");
        toast.error("Invalid image URL");
      };
      img.src = url;
    } catch {
      setPreviewAvatar("");
      toast.error("Invalid image URL");
    }
  };

  const getUniqueJobsByTitle = (jobs: Job[]) => {
    const uniqueJobTitles = new Map<string, Job>();
    jobs.forEach((job) => {
      if (!uniqueJobTitles.has(job.job_rank)) {
        uniqueJobTitles.set(job.job_rank, job);
      }
    });
    return Array.from(uniqueJobTitles.values()).sort((a, b) =>
      a.job_rank.localeCompare(b.job_rank)
    );
  };

  const handleImageUpload = (imageUrl: string) => {
    setPreviewAvatar(imageUrl);
    setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
  };

  if (!modalVisible && !isEmbedded) return null;

  if (isEmbedded) {
    return (
      <form
        onSubmit={handleSubmit}
        className="h-[600px] flex flex-col bg-white"
      >
        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Profile Image
                </h3>
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar Preview với Upload Overlay */}
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden">
                      {previewAvatar ? (
                        <img
                          src={previewAvatar}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageUploader onImageUploaded={handleImageUpload} />
                    </div>
                  </div>

                  {/* URL Input và Preview Button */}
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.avatar_url || ""}
                        onChange={(e) => validateImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          validateImageUrl(formData.avatar_url || "")
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      {/* <label className="block text-sm font-medium text-gray-600 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.full_name || ""}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                      /> */}

                      {/* Full Name Employee */}
                      <Form.Item
                        name="full_name"
                        label={
                          <span>
                            Full Name<span className="text-red-600">*</span>
                          </span>
                        }
                        rules={[
                          { required: true, message: "Full Name is required" },
                        ]}
                      ></Form.Item>
                      <Input
                        type="text"
                        value={formData.full_name || ""}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                      />
                    </div>

                    {/* Phone Employee */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
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
                    </div> */}
                    <div>
                      <Form.Item
                        name="phone"
                        label={
                          <span>
                            Phone<span className="text-red-600">*</span>
                          </span>
                        }
                        rules={[
                          { required: true, message: "Phone is required" },
                        ]}
                      ></Form.Item>
                      <Input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>

                    {/* Address Employee */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
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
                    </div> */}

                    <div>
                      <Form.Item
                        name="address"
                        label={
                          <span>
                            Address<span className="text-red-600">*</span>
                          </span>
                        }
                        rules={[
                          { required: true, message: "Address is required" },
                        ]}
                      ></Form.Item>
                      <Input
                        type="text"
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Employment Details
                  </h3>
                  <div className="space-y-4">
                  {/* Job Rank */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Job Rank
                      </label>
                      {isLoading ? (
                        <div className="text-gray-500">Loading jobs...</div>
                      ) : (
                        <select
                          value={formData.job_rank || ""}
                          onChange={(e) =>
                            handleInputChange("job_rank", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        >
                          <option value="">Select Job Rank</option>
                          {getUniqueJobsByTitle(jobs).map((job) => (
                            <option key={job._id} value={job.job_rank}>
                              {job.job_rank}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Department
                      </label>
                      {isLoading ? (
                        <div className="text-gray-500">
                          Loading departments...
                        </div>
                      ) : (
                        <select
                          value={formData.department_code || ""}
                          onChange={(e) =>
                            handleInputChange("department_code", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.department_code}>
                              {dept.department_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* Contract Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Contract Type
                      </label>
                      {isLoading ? (
                        <div className="text-gray-500">
                          Loading contracts...
                        </div>
                      ) : (
                        <select
                          value={formData.contract_type || ""}
                          onChange={(e) =>
                            handleInputChange("contract_type", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                        >
                          <option value="">Select Contract Type</option>
                          {contracts.map((contract) => (
                            <option
                              key={contract._id}
                              value={contract.contract_type}
                            >
                              {contract.description}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {/* Salary */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Salary
                      </label>
                      <input
                        type="number"
                        value={formData.salary || 0}
                        onChange={(e) =>
                          handleInputChange("salary", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Period */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contract Period
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
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
                    <label className="block text-sm font-medium text-gray-600 mb-2">
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
          )}
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
              className="px-4 py-2 bg-[#FF9447] text-white rounded hover:bg-[#FF8347]"
              disabled={isSubmitting || isLoading || !!error} // Vô hiệu hóa khi loading hoặc có lỗi
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out"
      style={{ opacity: isAnimating ? 1 : 0 }}
    >
      <div
        className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={handleClose}
      ></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg w-full max-w-4xl p-6 transition-all duration-300 ease-in-out transform"
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "scale(1)" : "scale(0.95)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#FF9447]">Edit Employee</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="h-[600px] flex flex-col bg-white"
          >
            <div className="flex-1 overflow-y-auto p-6">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Profile Image
                    </h3>
                    <div className="flex flex-col items-center gap-4">
                      {/* Avatar Preview với Upload Overlay */}
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden">
                          {previewAvatar ? (
                            <img
                              src={previewAvatar}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                              <User className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageUploader onImageUploaded={handleImageUpload} />
                        </div>
                      </div>

                      {/* URL Input và Preview Button */}
                      <div className="w-full max-w-md">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.avatar_url || ""}
                            onChange={(e) => validateImageUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                            placeholder="https://example.com/image.jpg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              validateImageUrl(formData.avatar_url || "")
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
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
                          <label className="block text-sm font-medium text-gray-600 mb-2">
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
                          <label className="block text-sm font-medium text-gray-600 mb-2">
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
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Employment Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Job Rank
                          </label>
                          {isLoading ? (
                            <div className="text-gray-500">Loading jobs...</div>
                          ) : (
                            <select
                              value={formData.job_rank || ""}
                              onChange={(e) =>
                                handleInputChange("job_rank", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                            >
                              <option value="">Select Job Rank</option>
                              {getUniqueJobsByTitle(jobs).map((job) => (
                                <option key={job._id} value={job.job_rank}>
                                  {job.job_title}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Department
                          </label>
                          {isLoading ? (
                            <div className="text-gray-500">
                              Loading departments...
                            </div>
                          ) : (
                            <select
                              value={formData.department_code || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "department_code",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                            >
                              <option value="">Select Department</option>
                              {departments.map((dept) => (
                                <option
                                  key={dept._id}
                                  value={dept.department_code}
                                >
                                  {dept.department_name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Contract Type
                          </label>
                          {isLoading ? (
                            <div className="text-gray-500">
                              Loading contracts...
                            </div>
                          ) : (
                            <select
                              value={formData.contract_type || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "contract_type",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                            >
                              <option value="">Select Contract Type</option>
                              {contracts.map((contract) => (
                                <option
                                  key={contract._id}
                                  value={contract.contract_type}
                                >
                                  {contract.description}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Salary
                          </label>
                          <input
                            type="number"
                            value={formData.salary || 0}
                            onChange={(e) =>
                              handleInputChange(
                                "salary",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Period */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Contract Period
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
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
                        <label className="block text-sm font-medium text-gray-600 mb-2">
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
              )}
            </div>
            <div className="px-6 py-4 border-t bg-white">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF9447] text-white rounded hover:bg-[#FF8347]"
                  disabled={isSubmitting || isLoading || !!error} // Vô hiệu hóa khi loading hoặc có lỗi
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <style>
        {`
          input, select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
          }
          
          input:focus, select:focus {
            border-color: #FF9447;
            box-shadow: 0 0 0 2px rgba(255, 148, 71, 0.2);
          }
          .ant-form-item-required{
          font-family: 'Squada-One';
          }
          .ant-form-item-required::before {
            display: none !important;
          }
          label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.25rem;
          }
          
          .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
    </div>
  );
};

export default EditEmployeeModal;
