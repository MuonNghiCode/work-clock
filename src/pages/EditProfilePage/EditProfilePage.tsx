import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, Select, Button, DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  changePassword,
  getAllJobs,
  getEmployeeByUserId,
  updateEmployee,
} from "../../services/userService";
import { getAllDepartments } from "../../services/userService";
import { getAllContracts } from "../../services/userService";
import dayjs from "dayjs";
import { EmployeeInfo, JobRank } from "../../types/Employee";
import { User } from "lucide-react";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { formatCurrency } from "../../utils/formatCurrency";
import { useUserStore } from "../../config/zustand";
export interface Department {
  _id: string;
  department_code: string;
  description: string;
}
// const { Option } = Select;
export interface Contract {
  _id: string;
  contract_type: string;
  description: string;
}

interface PasswordData extends Record<string, string> {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface FormData {
  job_rank: string;
  contract_type: string;
  account: string;
  address: string;
  phone: string;
  department_name: string;
  full_name: string;
  avatar_url: string;
  department_code: string;
  salary: number;
  user_id: string;
  is_deleted: boolean;
  start_date: Date | null;
  end_date: Date | null;
  updated_by: string;
}

const EditProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    job_rank: "",
    user_id: "",
    contract_type: "",
    account: "",
    address: "",
    phone: "",
    department_name: "",
    full_name: "",
    avatar_url: "",
    department_code: "",
    salary: 0,
    start_date: null,
    end_date: null,
    is_deleted: false,
    updated_by: "",
  });

  const [activeTab, setActiveTab] = useState<"account" | "password">("account");

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [jobrank, setJobRank] = useState<JobRank[]>([]);
  const [previewAvatar, setPreviewAvatar] = useState("");

  // const [showStartCalendar, setShowStartCalendar] = useState(false);
  // const [showEndCalendar, setShowEndCalendar] = useState(false);
  // Lấy userId từ localStorage sau khi đăng nhập
  useEffect(() => {
    const userData = useUserStore.getState().user;
    const storedUserId = userData?.id;
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Gọi API lấy thông tin nhân viên khi có userId
  useEffect(() => {
    if (userId) {
      getEmployeeByUserId(userId)
        .then((response) => {
          if (response.success) {
            const data = response.data;
            const updatedData = {
              job_rank: data.job_rank,
              user_id: userId,
              contract_type: data.contract_type,
              account: data.account,
              address: data.address,
              phone: data.phone,
              full_name: data.full_name,
              avatar_url: data.avatar_url || "",
              is_deleted: data.is_deleted,
              updated_by: data.updated_by,
              department_name: data.department_name,
              department_code: data.department_code,
              salary: data.salary,
              start_date: data.start_date ? new Date(data.start_date) : null,
              end_date: data.end_date ? new Date(data.end_date) : null,
            };

            setFormData(updatedData); // Cập nhật state
            form.setFieldsValue(updatedData); // Cập nhật form
          } else {
            console.error("Error fetching employee data:", response.message);
          }
        })
        .catch((error) =>
          console.error("Error fetching employee data:", error)
        );
    }
  }, [userId, form]); // Thêm `form` vào dependency để tránh lỗi form không cập nhật

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const deptData = await getAllDepartments();
        const contractData = await getAllContracts();
        const jobRankData = await getAllJobs();
        setJobRank(jobRankData.data);
        setDepartments(deptData.data);
        setContracts(contractData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = useUserStore.getState().user;
    const storedUserId = userData?.id;

    if (!storedUserId) {
      toast.error("User ID is missing");
      return;
    }

    const formattedData: EmployeeInfo = {
      ...formData,
      start_date: formData.start_date ? formData.start_date.toISOString() : "",
      end_date: formData.end_date ? formData.end_date.toISOString() : null,
    };

    try {
      await updateEmployee(storedUserId, formattedData);
      localStorage.setItem("accountData", JSON.stringify(formattedData));
      toast.success("Employee updated successfully!");

      // Refresh the employee data
      const updatedEmployeeData = await getEmployeeByUserId(storedUserId);
      setFormData({
        job_rank: updatedEmployeeData.data.job_rank,
        user_id: storedUserId,
        contract_type: updatedEmployeeData.data.contract_type,
        account: updatedEmployeeData.data.account,
        address: updatedEmployeeData.data.address,
        phone: updatedEmployeeData.data.phone,
        full_name: updatedEmployeeData.data.full_name,
        avatar_url: updatedEmployeeData.data.avatar_url || "",
        is_deleted: updatedEmployeeData.data.is_deleted,
        updated_by: updatedEmployeeData.data.updated_by,
        department_name: updatedEmployeeData.data.department_name,
        department_code: updatedEmployeeData.data.department_code,
        salary: updatedEmployeeData.data.salary,
        start_date: updatedEmployeeData.data.start_date
          ? new Date(updatedEmployeeData.data.start_date)
          : null,
        end_date: updatedEmployeeData.data.end_date
          ? new Date(updatedEmployeeData.data.end_date)
          : null,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error updating employee");
    }
    let newErrors: { phone?: string } = {};

    // Kiểm tra Phone Number
    if (!formData.phone) {
      newErrors.phone = "Empty field! Please enter your phone number";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Only numbers are allowed!";
    }

    // Nếu không có lỗi, tiến hành submit form
    console.log("Form submitted:", formData);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
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

  const handleImageUpload = (imageUrl: string) => {
    setPreviewAvatar(imageUrl);
    setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, avatar_url: url }));
    validateImageUrl(url);
  };

  useEffect(() => {
    if (formData.avatar_url) {
      validateImageUrl(formData.avatar_url);
    }
  }, [formData.avatar_url]);
  // Submit cho Change Password
  const handleSubmitPassword = async (values: any) => {
    // Kiểm tra mật khẩu xác nhận
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Confirm password does not match!");
      return;
    }

    try {
      const response = await changePassword(
        values.oldPassword,
        values.newPassword
      );
      if (response.success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(response.message || "Old password is incorrect!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center bg-transparent">
      <div className="w-full  bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Section */}
          <div className="mb-8 lg:mb-0 lg:w-1/3">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Profile Image
            </h3>
            <div className="flex flex-col items-center gap-4">
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
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageUploader onImageUploaded={handleImageUpload} />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.avatar_url || ""}
                  onChange={handleImageUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-2/3">
            <div className="mb-4 border-b">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`pb-2 font-semibold ${activeTab === "account"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                    }`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`pb-2 font-semibold ${activeTab === "password"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                    }`}
                >
                  Change Password
                </button>
              </nav>
            </div>

            {activeTab === "account" && (
              <Form
                form={form}
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmitCapture={handleSubmit}
              >
                <Form.Item
                  label="Account"
                  name="account"
                  rules={[{ required: true, message: "Account is required!" }]}
                >
                  <Input
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Full Name"
                  name="full_name"
                  rules={[
                    { required: true, message: "Full Name is required!" },
                  ]}
                >
                  <Input
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { required: true, message: "Phone number is required!" },
                    { pattern: /^\d+$/, message: "Only numbers are allowed!" },
                  ]}
                >
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Address is required!" }]}
                >
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item label="Job Rank">
                  <Select value={formData.job_rank} disabled className="w-full">
                    {jobrank.map((job) => (
                      <Select.Option key={job.id} value={job.job_rank}>
                        {job.job_rank}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Department Code">
                  <Select
                    value={formData.department_code}
                    disabled
                    className="w-full"
                  >
                    {departments.map((dept) => (
                      <Select.Option
                        key={dept._id}
                        value={dept.department_code}
                      >
                        {dept.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Contract Type">
                  <Select
                    value={formData.contract_type}
                    disabled
                    className="w-full"
                  >
                    {contracts.map((contract) => (
                      <Select.Option
                        key={contract._id}
                        value={contract.contract_type}
                      >
                        {contract.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Salary">
                  <Input
                    value={formatCurrency(formData.salary)}
                    disabled
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item label="Start Date" className="w-full">
                  <DatePicker
                    value={
                      formData.start_date ? dayjs(formData.start_date) : null
                    }
                    disabled
                    suffixIcon={<CalendarOutlined />}
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item label="End Date" className="w-full">
                  <DatePicker
                    value={formData.end_date ? dayjs(formData.end_date) : null}
                    disabled
                    suffixIcon={<CalendarOutlined />}
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item className="col-span-2 flex justify-start mt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!bg-[#ff8c00] !hover:bg-[#e67e22] text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Update
                  </Button>
                </Form.Item>
              </Form>
            )}

            {activeTab === "password" && (
              <div className="w-full flex justify-center">
                <div className="w-full max-w-md">
                  <Form
                    onFinish={handleSubmitPassword}
                    layout="vertical"
                    className="p-6 shadow-md bg-white w-full"
                  >
                    <Form.Item
                      label="Old Password"
                      name="oldPassword"
                      rules={[
                        {
                          required: true,
                          message: "Old Password is required!",
                        },
                      ]}
                    >
                      <Input.Password
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Old Password"
                        iconRender={(visible) =>
                          visible ? <FaEyeSlash /> : <FaEye />
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="New Password"
                      name="newPassword"
                      rules={[
                        {
                          required: true,
                          message: "New Password is required!",
                        },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters",
                        },
                      ]}
                    >
                      <Input.Password
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        iconRender={(visible) =>
                          visible ? <FaEyeSlash /> : <FaEye />
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Confirm Password is required!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm Password"
                        iconRender={(visible) =>
                          visible ? <FaEyeSlash /> : <FaEye />
                        }
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-[#ff8c00] hover:bg-[#e67e22] text-white py-3 text-lg"
                      >
                        Change Password
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
