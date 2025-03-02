import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { createUser, triggerVerifyToken } from "../../../services/userAuth";
import { NewUser } from "../../../pages/AdminPage/AdminUser/AdminUserManagement";

interface UserManagementAddProps {
  onClose: () => void;
  onSuccess: (newUser: NewUser) => void;
}

// Sử dụng React.memo để tránh render lại không cần thiết
const UserManagementAdd: React.FC<UserManagementAddProps> = React.memo(({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<NewUser>({
    user_name: "",
    email: "",
    password: "",
    role_code: "A002",
    is_blocked: true,
    is_verified: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tối ưu validation với useCallback
  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Username is required";
    } else if (formData.user_name.length < 3) {
      newErrors.user_name = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role_code) {
      newErrors.role_code = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Tối ưu handleSubmit với useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await createUser(formData);
      if (response.success) {
        toast.success("User created successfully");
        
        onSuccess(formData);
        
        try {
          await triggerVerifyToken(formData.email);
          toast.success("Verification email sent successfully");
        } catch (verifyError: any) {
          toast.warning("User created but failed to send verification email");
        }
        
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, isSubmitting, onSuccess, onClose]);

  // Tối ưu handleChange
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

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
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.user_name ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.user_name && <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>}
        </div>

        {/* Email field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
          <select
            name="role_code"
            value={formData.role_code}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.role_code ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Select Role</option>
            <option value="A001">Admin (A001)</option>
            <option value="A002">User (A002)</option>
            <option value="A003">Staff (A003)</option>
            <option value="A004">Paid (A004)</option>
          </select>
          {errors.role_code && <p className="text-red-500 text-sm mt-1">{errors.role_code}</p>}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default UserManagementAdd;