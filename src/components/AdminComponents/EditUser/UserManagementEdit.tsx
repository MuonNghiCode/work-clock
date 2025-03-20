import React from "react";
import { Form, Input, message } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { User } from "../../../pages/AdminPage/AdminUser/AdminUserManagement";
import { updateUser } from "../../../services/userAuth";
// import Icons from "../../icon";
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
        <div>
          <Form.Item
            label={
              <span>
                Username <span className="text-red-600">*</span>
              </span>
            }
            name="user_name"
            rules={[
              { required: true, message: "Username is required" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input suffix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>
        </div>

        {/* Email Field */}
        <div>
          <Form.Item
            name="email"
            label={
              <span>
                Email <span className="text-red-600">*</span>
              </span>
            }
            rules={[
              { required: true, message: "Email is required" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Only @gmail.com emails allowed",
              },
            ]}
          >
            <Input
              suffix={<MailOutlined />}
              placeholder="Enter email address"
            />
          </Form.Item>
        </div>

        <hr className="text-gray-400 bg-gray-400 mb-5" />
        {/* Buttons */}
        <div className="edit-form-buttons">
          <button type="button" onClick={onClose} className="edit-form-cancel">
            Cancel
          </button>
          {/* <Button type="primary" htmlType="submit">
            Apply Changes
          </Button> */}
          <button type="submit" className="edit-form-submit">
            Apply Changes
          </button>
        </div>
      </Form>
    </div>
  );
};

export default UserManagementEdit;
