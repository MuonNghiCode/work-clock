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
          // is_deleted: false
        });

        if (response.success) {
          toast.success("User created successfully");
          onSuccess(userData);

          try {
            toast.success("Verification email sent successfully");
          } catch (error) {
            console.error("Error sending verification email:", error);
            toast.warning("User created but failed to send verification email");
          }

          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          toast.error(response.message || "Failed to create user");
        }
      } catch (error: unknown) {
        console.error("Error creating user:", error);
        toast.error(
          error instanceof Error ? error.message : "Error creating user"
        );
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
            <Input />
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
            <Input />
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
            <Select>
              <Select.Option value="A001">Admin</Select.Option>
              <Select.Option value="A002">Finance</Select.Option>
              <Select.Option value="A003">Approval</Select.Option>
              <Select.Option value="A004">Member other</Select.Option>
            </Select>
          </Form.Item>

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
              className="px-4 py-2 bg-[#FF9447] text-white rounded-md hover:bg-[#FF8335] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </Form>

        <style>
          {`
          input, select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
          }
          .ant-form-item-required {
          font-family: 'Squada-One';
          

          }
          input:focus, select:focus {
            border-color: #FF9447;
            box-shadow: 0 0 0 2px rgba(255, 148, 71, 0.2);
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
  }
);

export default UserManagementAdd;
