import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { updateEmployee } from "../../../services/userService";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosUser";
import ImageUploader from "../../ImageUploader/ImageUploader";
import { EmployeeInfo } from "../../../types/Employee";
import { Form, Input, Select } from "antd";

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
//   salary: number;npm i
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
const { Option } = Select;

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  isEmbedded = false,
  onUpdateSuccess,
}) => {
  const [form] = Form.useForm();
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
      const newFormData = {
        user_id: employee.user_id,
        job_rank: employee.job_rank,
        contract_type: employee.contract_type,
        account: employee.account,
        address: employee.address || "",
        phone: employee.phone,
        full_name: employee.full_name,
        avatar_url: employee.avatar_url,
        department_code: employee.department_code,
        salary: employee.salary || 0,
        start_date: formatDate(employee.start_date),
        end_date: employee.end_date ? formatDate(employee.end_date) : "",
      };
      setFormData(newFormData);
      form.setFieldsValue(newFormData);
      setPreviewAvatar(employee.avatar_url || ""); // Đồng bộ previewAvatar
    } else {
      console.log("No employee data provided");
    }
  }, [employee, form]);

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
  // const handleClose = () => {
  //   setIsAnimating(false);
  //   setTimeout(() => onClose(), 300);
  // };

  const handleSubmit = async (values: EmployeeInfo) => {
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

      const response = await updateEmployee(employee.user_id, updateData);
      if(response.success){
        toast.success("Employee updated successfully");
      }
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
  console.log(formData);

  if (!modalVisible && !isEmbedded) return null;

  if (isEmbedded) {
    return (
      // <form
      //   onSubmit={handleSubmit}
      //   className="h-[600px] flex flex-col bg-white"
      // >
      <Form
        form={form}
        onValuesChange={(changedValues) =>
          setFormData((prev) => ({ ...prev, ...changedValues }))
        }
        layout="vertical"
        initialValues={formData}
        onFinish={handleSubmit}
      >
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
                      style={{ marginBottom: "16px" }}
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      <Input
                        type="text"
                        value={formData.full_name || ""}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      name="phone"
                      label={
                        <span>
                          Phone<span className="text-red-600">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Phone is required" }]}
                    >
                      <Input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </Form.Item>
                  </div>

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
                    >
                      <Input
                        type="text"
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </Form.Item>
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
                  <Form.Item
                    name="job_rank"
                    label={
                      <span>
                        Job Rank<span className="text-red-600">*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: "Job Rank is required" },
                    ]}
                  >
                    {isLoading ? (
                      <div className="text-gray-500">Loading jobs...</div>
                    ) : (
                      <Select
                        defaultValue={formData.job_rank}
                        value={formData.job_rank}
                        onChange={(value) =>
                          handleInputChange("job_rank", value)
                        }
                        placeholder="Select Job Rank"
                        style={{ width: "100%" }}
                      >
                        {getUniqueJobsByTitle(jobs).map((job) => (
                          <Option key={job._id} value={job.job_rank}>
                            {job.job_rank}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {/* Department */}
                  <Form.Item
                    name="department_code"
                    label={
                      <span>
                        Department<span className="text-red-600">*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: "Department is required" },
                    ]}
                  >
                    {isLoading ? (
                      <div className="text-gray-500">
                        Loading departments...
                      </div>
                    ) : (
                      <Select
                        defaultValue={formData.department_code}
                        value={formData.department_code}
                        onChange={(value) =>
                          handleInputChange("department_code", value)
                        }
                        placeholder="Select Department"
                        style={{ width: "100%" }}
                      >
                        {departments.map((dept) => (
                          <Option key={dept._id} value={dept.department_code}>
                            {dept.department_name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {/* Contract Type */}
                  <Form.Item
                    name="contract_type"
                    label={
                      <span>
                        Contract Type<span className="text-red-600">*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: "Contract Type is required" },
                    ]}
                  >
                    {isLoading ? (
                      <div className="text-gray-500">Loading contracts...</div>
                    ) : (
                      <Select
                        defaultValue={formData.contract_type}
                        value={formData.contract_type}
                        onChange={(value) =>
                          handleInputChange("contract_type", value)
                        }
                        placeholder="Select Contract Type"
                        style={{ width: "100%" }}
                      >
                        {contracts.map((contract) => (
                          <Option
                            key={contract._id}
                            value={contract.contract_type}
                          >
                            {contract.description}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  {/* Salary */}
                  <Form.Item
                    name="salary"
                    label={
                      <span>
                        Salary<span className="text-red-600">*</span>
                      </span>
                    }
                    rules={[{ required: true, message: "Salary is required" }]}
                  >
                    <Input
                      type="number"
                      value={formData.salary || 0}
                      onChange={(e) =>
                        handleInputChange("salary", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Contract Period */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Contract Period
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <Form.Item
                  name="start_date"
                  label={
                    <span className="block text-sm font-medium text-gray-600 mb-2">
                      Start Date
                    </span>
                  }
                  rules={[
                    { required: true, message: "Start Date is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('end_date') || new Date(value) < new Date(getFieldValue('end_date'))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Start Date must be before End Date'));
                      },
                    }),
                  ]}
                >
                  <Input
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </Form.Item>
                <Form.Item
                  name="end_date"
                  label={
                    <span className="block text-sm font-medium text-gray-600 mb-2">
                      End Date
                    </span>
                  }
                  rules={[{ required: true, message: "End Date is required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || !getFieldValue('start_date') || new Date(value) > new Date(getFieldValue('start_date'))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('End Date must be after Start Date'));
                      },
                    }),
                  ]}
                >
                  <Input
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) =>
                      handleInputChange("end_date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        )}
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
      </Form>
      // </div>

      // </form>
    );
  }
};

export default EditEmployeeModal;
