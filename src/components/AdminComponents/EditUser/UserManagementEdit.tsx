import React, { useState } from "react";
import { Mail} from "lucide-react";
import { User } from '../../../pages/AdminPage/AdminUser/AdminUserManagement';
import { toast } from "react-toastify";
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
  const [editingUser, setEditingUser] = useState<User<string>>(user);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateBasicInfo = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!editingUser.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (editingUser.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    if (!editingUser.email) {
      newErrors.email = "Email is required";  
    } else if (!editingUser.email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      newErrors.email = "Only @gmail.com email addresses are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateBasicInfo = async () => {
    try {
      if (!validateBasicInfo()) return;

      const updateData = {
        user_id: user.id,
        user_name: editingUser.user_name,
        email: editingUser.email
      };

      await updateUser(user.id, updateData);

      const updatedUser: User<string> = {
        ...editingUser,
        user_name: updateData.user_name,
        email: updateData.email,
        id: user.id,
        user_id: user.id,
        role_code: user.role_code,
        is_blocked: user.is_blocked,
        is_verified: user.is_verified,
        is_deleted: user.is_deleted
      };

      onSubmit(updatedUser);
      toast.success("User information updated successfully");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update user information");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Edit Account</h3>
        </div>
      </div>

      <form className="flex flex-col">
        {/* Form Content */}
        <div className="p-6">
          <div className="grid gap-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={editingUser.user_name}
                onChange={(e) => setEditingUser({ ...editingUser, user_name: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-orange-200 transition-all ${
                  errors.user_name ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Enter username"
              />
              {errors.user_name && (
                <p className="mt-1.5 text-sm text-red-500">{errors.user_name}</p>
              )}
            </div>
            
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-orange-200 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateBasicInfo}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserManagementEdit; 