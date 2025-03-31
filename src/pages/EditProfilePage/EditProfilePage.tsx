import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, Button } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  changePassword,
  getEmployeeByUserId,
  updateEmployee,
} from "../../services/userService";
import { EmployeeInfo } from "../../types/Employee";
import { User } from "lucide-react";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { formatCurrency } from "../../utils/formatCurrency";
import { useUserStore } from "../../config/zustand";
import Icons from "../../components/icon";

export interface Department {
  _id: string;
  department_code: string;
  description: string;
}

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

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  useEffect(() => {
    const userData = useUserStore.getState().user;
    const storedUserId = userData?.id;
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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

            setFormData(updatedData);
            form.setFieldsValue(updatedData);
          } else {
            console.error("Error fetching employee data:", response.message);
          }
        })
        .catch((error) =>
          console.error("Error fetching employee data:", error)
        );
    }
  }, [userId, form]);

  const handleSubmit = async () => {
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

  return (
    <div className="flex justify-center bg-transparent">
      <div className="w-full bg-white shadow rounded-lg p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Avatar and Info Cards */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Avatar Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Profile Image
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-[#ff914d]/60 overflow-hidden">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF914d] focus:border-[#FF914d]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Info Cards - Job Details */}
          <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
            {[
              {
                label: "Job Rank",
                value: formData.job_rank || "N/A",
                color: "text-orange-500",
                icon: Icons.Medal,
              },
              {
                label: "Department Code",
                value: formData.department_code || "N/A",
                color: "text-blue-500",
                icon: Icons.Building,
              },
              {
                label: "Contract Type",
                value: formData.contract_type || "N/A",
                color: "text-purple-500",
                icon: Icons.FileText,
              },
              {
                label: "Salary",
                value: formatCurrency(formData.salary),
                color: "text-green-500",
                icon: Icons.Dollar,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    <item.icon className="w-6 h-6 text-gray-700" />
                  </span>
                  <span className="text-base font-semibold text-gray-700">
                    {item.label}
                  </span>
                </div>
                <span className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Form Section */}
        <div className="lg:w-2/3">
          {/* Account Settings Form */}
          <div className="mb-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Account Settings
            </h2>
          </div>
          <Form
            form={form}
            layout="vertical"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onFinish={handleSubmit}
          >
            <Form.Item
              label={
                <span>
                  Account <span className="text-red-600">*</span>
                </span>
              }
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
              label={
                <span>
                  Full Name<span className="text-red-600">*</span>
                </span>
              }
              name="full_name"
              rules={[{ required: true, message: "Full Name is required!" }]}
            >
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Phone Number<span className="text-red-600">*</span>
                </span>
              }
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
              label={
                <span>
                  Address<span className="text-red-600">*</span>
                </span>
              }
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

            <Form.Item className="col-span-2 flex justify-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-brand-gradient !hover:bg-[#e67e22] text-white font-semibold px-6 py-2 rounded-lg"
              >
                Update Account
              </Button>
            </Form.Item>
          </Form>

          {/* Change Password Form */}
          <div className="mt-8 mb-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">
              Change Password
            </h2>
          </div>
          <Form
            layout="vertical"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onFinish={async () => {
              if (
                passwordData.newPassword &&
                passwordData.newPassword !== passwordData.confirmPassword
              ) {
                toast.error("Confirm password does not match!");
                return;
              }
              try {
                await changePassword(
                  passwordData.oldPassword,
                  passwordData.newPassword
                );
                toast.success("Password changed successfully!");
              } catch (error) {
                console.error("Error changing password:", error);
                toast.error("Error changing password");
              }
            }}
          >
            <Form.Item
              label={
                <span>
                  Old Password <span className="text-red-600">*</span>
                </span>
              }
              name="oldPassword"
              rules={[
                { required: true, message: "Old Password is required!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Old Password"
                iconRender={(visible) => (visible ? <FaEyeSlash /> : <FaEye />)}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  New Password <span className="text-red-600">*</span>
                </span>
              }
              name="newPassword"
              rules={[
                { required: true, message: "New Password is required!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                iconRender={(visible) => (visible ? <FaEyeSlash /> : <FaEye />)}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Confirm Password <span className="text-red-600">*</span>
                </span>
              }
              name="confirmPassword"
              dependencies={["newPassword"]}
              className="col-span-2"
              rules={[
                { required: true, message: "Confirm Password is required!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <FaEyeSlash /> : <FaEye />)}
              />
            </Form.Item>

            <Form.Item className="col-span-2 flex justify-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-brand-gradient !hover:bg-[#e67e22] text-white font-semibold px-6 py-2 rounded-lg"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
