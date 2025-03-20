import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { updateEmployee } from "../../../services/userService";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosUser";
import ImageUploader from "../../ImageUploader/ImageUploader";
import { EmployeeInfo } from "../../../types/Employee";
import { ConfigProvider, Form, Input, Select } from "antd";

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
  // const [isAnimating, setIsAnimating] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);

  // Handle modal open/close animations
  // useEffect(() => {
  //   if (isOpen) {
  //     setModalVisible(true);
  //     setTimeout(() => setIsAnimating(true), 10);
  //   } else {
  //     setIsAnimating(false);
  //     const timer = setTimeout(() => setModalVisible(false), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen]);

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

  const handleSubmit = async () => {
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
      onUpdateSuccess?.(updateData);
      }
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

  // const handleInputChange = (field: keyof EmployeeInfo, value: unknown) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

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

  if (!isEmbedded) return null;

  if (isEmbedded) {
    return (
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Squada One",
            colorPrimary: "#FF9447",
            colorBorder: "#E5E7EB",
            borderRadius: 8,
            colorBgContainer: "#FFFFFF",
            colorTextBase: "#374151",
            fontSize: 14,
          },
          components: {
            Input: {
              fontFamily: "Squada One",
            },
            Select: {
              fontFamily: "Squada One",
            },
            Form: {
              labelFontSize: 14,
              fontFamily: "Squada One",
            },
          },
        }}
      >
        <Form
          form={form}
          onValuesChange={(changedValues) =>
            setFormData((prev) => ({ ...prev, ...changedValues }))
          }
          layout="vertical"
          initialValues={formData}
          onFinish={handleSubmit}
          className="bg-white rounded-lg shadow-sm font-['Squada_One']"
        >
          {error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4 font-['Squada_One']">{error}</div>
          ) : (
            <div className="space-y-8 p-6">
              {/* Avatar Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#FF9447] mb-4 border-b pb-2 font-['Squada_One']">
                  Profile Image
                </h3>
                <div className="flex flex-col items-center gap-6">
                  {/* Avatar Preview with Upload Overlay */}
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden shadow-lg transition-all duration-300 hover:border-[#FF9447]">
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
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer">
                      <ImageUploader onImageUploaded={handleImageUpload} />
                    </div>
                  </div>

                  {/* URL Input and Preview Button */}
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-['Squada_One']">
                      Image URL<span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.avatar_url || ""}
                        onChange={(e) => validateImageUrl(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9447]/20 focus:border-[#FF9447] transition-all duration-200 font-['Squada_One']"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => validateImageUrl(formData.avatar_url || "")}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-['Squada_One']"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information and Employment Details Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-gray-50/70 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold text-[#FF9447] mb-6 border-b pb-2 font-['Squada_One']">
                    Personal Information
                  </h3>
                  <div className="space-y-5">
                    <Form.Item
                      name="full_name"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Full Name<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Full Name is required" }]}
                      className="mb-4"
                    >
                      <Input className="rounded-lg py-2 font-['Squada_One']" />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label={
                        <span className=" font-medium text-gray-700 font-['Squada_One']">
                          Phone<span className="text-red-500 ml-1">*</span>
                        </span>
                      }required
                      rules={[{ required: true, message: "Phone is required" }]}
                    >
                      <Input className="rounded-lg py-2 font-['Squada_One']" />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Address<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Address is required" }]}
                    >
                      <Input className="rounded-lg py-2 font-['Squada_One']" />
                    </Form.Item>
                  </div>
                </div>

                <div className="bg-gray-50/70 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold text-[#FF9447] mb-6 border-b pb-2 font-['Squada_One']">
                    Employment Details
                  </h3>
                  <div className="space-y-5">
                    <Form.Item
                      name="job_rank"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Job Rank<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Job Rank is required" }]}
                    >
                      {isLoading ? (
                        <div className="text-gray-500 font-['Squada_One']">Loading jobs...</div>
                      ) : (
                        <Select
                          className="w-full rounded-lg font-['Squada_One']"
                          placeholder="Select Job Rank"
                          dropdownStyle={{ fontFamily: 'Squada One' }}
                        >
                          {getUniqueJobsByTitle(jobs).map((job) => (
                            <Option key={job._id} value={job.job_rank}>
                              {job.job_rank}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="department_code"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Department<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Department is required" }]}
                    >
                      {isLoading ? (
                        <div className="text-gray-500 font-['Squada_One']">Loading departments...</div>
                      ) : (
                        <Select
                          className="w-full rounded-lg font-['Squada_One']"
                          placeholder="Select Department"
                          dropdownStyle={{ fontFamily: 'Squada One' }}
                        >
                          {departments.map((dept) => (
                            <Option key={dept._id} value={dept.department_code}>
                              {dept.department_name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="contract_type"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Contract Type<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Contract Type is required" }]}
                    >
                      {isLoading ? (
                        <div className="text-gray-500 font-['Squada_One']">Loading contracts...</div>
                      ) : (
                        <Select
                          className="w-full rounded-lg font-['Squada_One']"
                          placeholder="Select Contract Type"
                          dropdownStyle={{ fontFamily: 'Squada One' }}
                        >
                          {contracts.map((contract) => (
                            <Option key={contract._id} value={contract.contract_type}>
                              {contract.description}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>

                    <Form.Item
                      name="salary"
                      label={
                        <span className="font-medium text-gray-700 font-['Squada_One']">
                          Salary<span className="text-red-500 ml-1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: "Salary is required" }]}
                    >
                      <Input type="number" className="rounded-lg py-2 font-['Squada_One']" />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* Contract Period */}
              <div className="bg-gray-50/70 p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[#FF9447] mb-6 border-b pb-2 font-['Squada_One']">
                  Contract Period
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <Form.Item
                    name="start_date"
                    label={
                      <span className="font-medium text-gray-700 font-['Squada_One']">
                        Start Date<span className="text-red-500 ml-1">*</span>
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
                    <Input type="date" className="rounded-lg py-2 font-['Squada_One']" />
                  </Form.Item>

                  <Form.Item
                    name="end_date"
                    label={
                      <span className="font-medium text-gray-700 font-['Squada_One']">
                        End Date<span className="text-red-500 ml-1">*</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: "End Date is required" },
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
                    <Input type="date" className="rounded-lg py-2 font-['Squada_One']" />
                  </Form.Item>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-white rounded-b-lg">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-['Squada_One']"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF9447] text-white rounded-lg hover:bg-[#FF8347] transition-colors duration-200 font-['Squada_One'] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isLoading || !!error}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Form>
      </ConfigProvider>
    );
  }
};

export default EditEmployeeModal;
