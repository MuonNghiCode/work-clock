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
    } else if (!editingUser.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
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

      const response = await updateUser(user.id, updateData);
      
      if (response.success) {
        const updatedUser = {...editingUser, ...updateData};
        onSubmit(updatedUser);
        toast.success(response.message || "User information updated successfully");
        onClose();
      } else {
        toast.error(response.message || "Failed to update user information");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update user information");
      }
    }
  };

  return (
    <form className="h-[400px] flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
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
        </div>
      </div>

      {/* Footer */}
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
            type="button"
            onClick={handleUpdateBasicInfo}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserManagementEdit; 