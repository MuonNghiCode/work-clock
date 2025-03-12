import React from "react";
import { Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { User } from "../../../pages/AdminPage/AdminUser/AdminUserManagement";
import { updateUser } from "../../../services/userAuth";

interface UserManagementEditProps {
  user: User<string>;
  onClose: () => void;
  onSubmit: (updatedUser: User<string>) => void;
}

const UserManagementEdit: React.FC<UserManagementEditProps> = ({
  user,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleUpdateBasicInfo = async (values: any) => {
    try {
      const updateData = {
        user_id: user.id,
        user_name: values.user_name,
        email: values.email,
      };

      await updateUser(user.id, updateData);

      const updatedUser: User<string> = {
        ...user,
        user_name: updateData.user_name,
        email: updateData.email,
      };

      onSubmit(updatedUser);
      // message.success("User information updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update user information");
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden p-6">
      {/* <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Account</h3> */}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateBasicInfo}
        initialValues={{ user_name: user.user_name, email: user.email }}
      >
        {/* Username Field */}
        <Form.Item
          label="Username"
          name="user_name"
          rules={[
            { required: true, message: "Username is required" },
            { min: 3, message: "Username must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Only @gmail.com emails allowed" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter email address" />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          {/* <Button type="primary" htmlType="submit">
            Apply Changes
          </Button> */}
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF9447] text-white rounded-md hover:bg-[#FF8335] transition-colors disabled:opacity-50">
            Apply Changes
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
          
          input:focus, select:focus {
            border-color: #FF9447;
            box-shadow: 0 0 0 2px rgba(255, 148, 71, 0.2);
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

export default UserManagementEdit;