import React, { useState } from "react";
import { Form, Input, Select } from "antd";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { createUser } from "../../../services/userAuth";
import { NewUser } from "../../../pages/AdminPage/AdminUser/AdminUserManagement";

interface UserManagementAddProps {
  onClose: () => void;
  onSuccess: (newUser: NewUser) => void;
}

interface FormValues {
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_code: string;
}

const UserManagementAdd: React.FC<UserManagementAddProps> = React.memo(
  ({ onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values: FormValues) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword: _, ...userData } = values;

        const response = await createUser({
          ...userData,
          is_blocked: false,
          is_verified: false,
        });

        if (response.success) {
          toast.success("User created successfully");
          onSuccess(userData);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (error: any) {
        console.error("Error creating user:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FF9447] mb-6">
            Add New User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ role_code: "A004" }}
        >
          <Form.Item
            name="user_name"
            label={
              <span>
                Username <span className="text-red-600">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Username is required" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input className="rounded-lg py-2 font-['Squada_One']" />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span>
                Email <span className="text-red-600">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter valid email" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Only @gmail.com emails allowed",
              },
            ]}
          >
            <Input className="rounded-lg py-2 font-['Squada_One']" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span>
                Password <span className="text-red-600">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span>
                Confirm password <span className="text-red-600">*</span>
              </span>
            }
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role_code"
            label={
              <span>
                Role <span className="text-red-600">*</span>
              </span>
            }
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select className="rounded-lg py-2 font-['Squada_One']">
              <Select.Option value="A001">Admin</Select.Option>
              <Select.Option value="A002">Finance</Select.Option>
              <Select.Option value="A003">Approval</Select.Option>
              <Select.Option value="A004">Member other</Select.Option>
            </Select>
          </Form.Item>
          <hr className="text-gray-400 bg-gray-400 mb-5" />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand-gradient text-white rounded-md hover:bg-[#FF8335] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </Form>
        <style>
          {`
                    .ant-form-item-label > label {
                        font-weight: 500;
                        color: #4B5563;
                    }

                    .ant-input, .ant-input-password {
                        border-radius: 8px;
                        border: 1px solid #E5E7EB;
                        padding: 8px 12px;
                        transition: all 0.3s ease;
                    }

                    .ant-input:hover, .ant-input-password:hover {
                        border-color: #FF9447;
                    }

                    .ant-input:focus, .ant-input-password:focus {
                        border-color: #FF9447;
                        box-shadow: 0 0 0 2px rgba(255, 148, 71, 0.2);
                    }

                    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
                        border-color: #FF9447;
                    }

                    .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
                        border-color: #FF9447;
                        box-shadow: 0 0 0 2px rgba(255, 148, 71, 0.2);
                    }

                    .ant-select-selector {
                        border-radius: 8px !important;
                        border: 1px solid #E5E7EB !important;
                        padding: 4px 12px !important;
                    }

                    .ant-form-item {
                        margin-bottom: 24px;
                    }

                    button[type="submit"] {
                        background: linear-gradient(to right, #FF9447, #FF8335);
                        transition: all 0.3s ease;
                    }

                    button[type="submit"]:hover:not(:disabled) {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px rgba(255, 148, 71, 0.2);
                    }

                    button[type="button"] {
                        transition: all 0.3s ease;
                    }

                    button[type="button"]:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                `}
        </style>
      </div>
    );
  }
);

export default UserManagementAdd;
