import React, { useState } from "react";
import { X } from "lucide-react";
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { NewUser } from '../../../pages/AdminPage/AdminUser/AdminUserManagement';

interface UserManagementAddProps {
  onClose: () => void;
  onSuccess: (newUser: NewUser) => void;
}

const USERS_STORAGE_KEY = 'workClock_users';
const EMAILJS_SERVICE_ID = "service_uyrvjh8";
const EMAILJS_TEMPLATE_ID = "template_x4moyfj";
const EMAILJS_PUBLIC_KEY = "TziMjgNiIl6W4_1CD";

const UserManagementAdd: React.FC<UserManagementAddProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<NewUser, 'confirmPassword'>>({
    user_name: "",
    email: "",
    password: "",
    role_code: "" 
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Username validation
    if (!formData.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (formData.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Role validation
    if (!formData.role_code) {
      newErrors.role_code = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const currentUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      const newUser = {
        ...formData,
        id: crypto.randomUUID(),
        isLocked: false // Set to false for unlocked status
      };

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...currentUsers, newUser]));
      
      const storedUserData = localStorage.getItem("userData");
      const currentUserData = storedUserData ? JSON.parse(storedUserData) : [];
      
      const newUserData = {
        name: formData.user_name,
        email: formData.email,
        password: formData.password,
        role: formData.role_code
      };

      localStorage.setItem("userData", JSON.stringify([...currentUserData, newUserData]));
      
      // Send welcome email
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: formData.email,
          to_name: formData.user_name,
          password: formData.password,
          role: formData.role_code,
        },
        EMAILJS_PUBLIC_KEY
      ).then(() => {
        toast.success("User added and welcome email sent successfully", {
          position: "top-right",
          autoClose: 1300,    
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
      }).catch((error) => {
        console.error("Failed to send email:", error);
        toast.error("User added but failed to send welcome email", {
          position: "top-right",
          autoClose: 1300,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
      });

      onSuccess(newUser);
      onClose();
    } catch {
      toast.error("Failed to add user", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Create New Account</h2>
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
            value={formData.user_name}
            onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
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
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <select
            value={formData.role_code}
            onChange={(e) => setFormData({ ...formData, role_code: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.role_code ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">Select Role</option>
            <option value="A001">Admin (A001)</option>
            <option value="A002">User (A002)</option>
            <option value="A003">Staff (A003)</option>
            <option value="A004">Paid (A004)</option>
          </select>
          {errors.role_code && (
            <p className="text-red-500 text-sm mt-1">{errors.role_code}</p>
          )}
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
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserManagementAdd;