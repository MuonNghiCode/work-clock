import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { User } from '../../../pages/AdminPage/AdminUser/AdminUserManagement';
import { toast } from "react-toastify";
import { changePassword, updateUser } from "../../../services/userAuth";

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
  const [editingUser, setEditingUser] = useState<User<string>>(user);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!editingUser.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (editingUser.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    if (!editingUser.email) {
      newErrors.email = "Email is required";  
    } else if (!editingUser.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
    }

    if (!editingUser.role_code) {
      newErrors.role_code = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!validateForm()) return;

      // Tách riêng phần update thông tin và đổi mật khẩu
      if (newPassword) {
        if (!oldPassword) {
          setErrors({ oldPassword: "Old password is required" });
          return;
        }

        try {
          await changePassword(oldPassword, newPassword);
          toast.success("Password changed successfully");
        } catch (error) {
          if (error instanceof Error) {
            setErrors({ oldPassword: error.message });
          } else {
            toast.error("Failed to change password");
          }
          return;
        }
      }

      // Update user information
      const updateData = {
        user_name: editingUser.user_name,
        email: editingUser.email
      };

      const response = await updateUser(user.id, updateData);
      if (response.success) {
        const updatedUser = {...editingUser, ...updateData};
        onClose();
        onSubmit(updatedUser);
        toast.success("User information updated successfully");
      }

    } catch (error) {
      console.error("Error updating:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user information");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-[600px] flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-7">
          {/* Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={editingUser.user_name}
              onChange={(e) => setEditingUser({ ...editingUser, user_name: e.target.value })}
              className={`w-full px-4 py-2 rounded-md border ${
                errors.user_name ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.user_name && (
              <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
            )}
          </div>
          
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          {/* Password fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Old Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.oldPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-white">
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserManagementEdit; 