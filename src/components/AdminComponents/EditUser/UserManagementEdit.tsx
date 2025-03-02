import React, { useState } from "react";
import { X, Mail, Lock, UserCog } from "lucide-react";
import { User } from '../../../pages/AdminPage/AdminUser/AdminUserManagement';

interface UserManagementEditProps {
  user: User;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
} 
0
const UserManagementEdit: React.FC<UserManagementEditProps> = ({
  user,
  onClose,
  onSubmit,
}) => {
  const [editingUser, setEditingUser] = useState<User>(user);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Username validation
    if (!editingUser.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (editingUser.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    // Email validation
    if (!editingUser.email) {
      newErrors.email = "Email is required";  
    } else if (!editingUser.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (only if changed)
    if (editingUser.password && editingUser.password !== user.password) {
      if (editingUser.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    // Role validation
    if (!editingUser.role_code) {
      newErrors.role_code = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(editingUser);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Edit Account</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              value={editingUser.password}
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              className={`pl-10 w-full px-4 py-2 rounded-md border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <UserCog className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={editingUser.role_code}
              onChange={(e) => setEditingUser({ ...editingUser, role_code: e.target.value })}
              className={`pl-10 w-full px-4 py-2 rounded-md border ${
                errors.role_code ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              <option value="">Select Role</option>
              <option value="A001">Admin (A001)</option>
              <option value="A002">User (A002)</option>
              <option value="A003">Staff (A003)</option>
              <option value="A004">Paid (A004)</option>
            </select>
          </div>
          {errors.role_code && (
            <p className="text-red-500 text-sm mt-1">{errors.role_code}</p>
          )}
        </div>

        {/* Lock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
          <button
            type="button"
            onClick={() => setEditingUser({ ...editingUser, is_blocked: !editingUser.is_blocked })}
            disabled={editingUser.role_code === "A001"}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              editingUser.role_code === "A001"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : editingUser.is_blocked
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-green-50 text-green-500 hover:bg-green-100"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{editingUser.is_blocked ? "LOCKED" : "UNLOCK"}</span>
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
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
      </form>
    </div>
  );
};

export default UserManagementEdit; 