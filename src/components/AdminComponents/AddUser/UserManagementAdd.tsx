import React, { useState } from "react";
import { X, Mail, Phone, MapPin, Calendar, User2, FileText, ImageIcon, Lock, Eye, EyeOff } from "lucide-react";
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify'; // Import Toastify

interface User {
id: string;
isLocked: boolean;
name: string;
email: string;
phoneNumber: string;
address: string;
birthday: string;
note: string;
role: "Admin" | "User" | "Staff" | "Paid";
avatar: string;
}

interface NewUser extends Omit<User, 'id' | 'isLocked'> {
name: string;
email: string;
password: string;
phoneNumber: string;
address: string;
birthday: string;
note: string;
role: "Admin" | "User" | "Staff" | "Paid";
avatar: string;
}

interface UserManagementAddProps {
  onClose: () => void;
  onSuccess: (newUser: NewUser) => void;
}

const USERS_STORAGE_KEY = 'workClock_users';
const EMAILJS_SERVICE_ID = "service_uyrvjh8";
const EMAILJS_TEMPLATE_ID = "template_x4moyfj";
const EMAILJS_PUBLIC_KEY = "TziMjgNiIl6W4_1CD";

const UserManagementAdd: React.FC<UserManagementAddProps> = ({ onClose, onSuccess }) => {
const [formData, setFormData] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    birthday: "",   
    note: "",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=new"
});

const [errors, setErrors] = useState<{[key: string]: string}>({});
const [showPassword, setShowPassword] = useState(false);

const validateForm = () => {
  const newErrors: {[key: string]: string} = {};
  
  // Validate required fields
  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  // Validate email
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    newErrors.email = "Invalid email format";
  }

  // Validate password
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  // Enhanced phone number validation
  if (!formData.phoneNumber) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!formData.phoneNumber.startsWith('0')) {
    newErrors.phoneNumber = "Phone number must start with 0";
  } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = "Phone number must be 10 digits";
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
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role.toLowerCase()
        };

        localStorage.setItem("userData", JSON.stringify([...currentUserData, newUserData]));
        
        // Send welcome email
        emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_email: formData.email,
                to_name: formData.name,
                password: formData.password,
                role: formData.role,
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
                autoClose: 13000,
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

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("File size should be less than 5MB", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setFormData(prev => ({
                ...prev,
                avatar: result
            }));
            toast.success("Image uploaded successfully", {
                position: "top-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
            });
        };

        reader.onerror = () => {
            toast.error("Error reading file", {
                position: "top-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
            });
        };

        reader.readAsDataURL(file);
    }
};

const handleAvatarUrlChange = (url: string) => {
    // Basic URL validation
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))/i;
    if (!url || urlPattern.test(url)) {
        setFormData(prev => ({
            ...prev,
            avatar: url
        }));
    } else {
        toast.error("Please enter a valid image URL", {
            position: "top-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light",
        });
    }
};

return (
    <div className="bg-white rounded-lg shadow-md">
    <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Add New User</h1>
        <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        >
        <X className="w-5 h-5" />
        </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User2 className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={formData.name.split(' ')[0]}
                    onChange={(e) => {
                    setFormData({
                        ...formData,
                        name: e.target.value + ' ' + formData.name.split(' ').slice(1).join(' ')
                    });
                    if (errors.name) setErrors({...errors, name: ''});
                    }}
                    placeholder="Enter first name"
                    className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User2 className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={formData.name.split(' ').slice(1).join(' ')}
                    onChange={(e) => {
                    setFormData({
                        ...formData,
                        name: formData.name.split(' ')[0] + ' ' + e.target.value
                    });
                    if (errors.name) setErrors({...errors, name: ''});
                    }}
                    placeholder="Enter last name"
                    className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
                </div>
            </div>
            {errors.name && (
                <p className="text-red-500 text-sm mt-1 col-span-2">{errors.name}</p>
            )}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({...errors, email: ''});
                }}
                placeholder="example@gmail.com"
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
            </div>
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({...errors, password: ''});
                }}
                placeholder="Minimum 6 characters"
                className={`pl-10 pr-10 w-full px-4 py-2 rounded-md border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
                </button>
            </div>
            {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({ ...formData, phoneNumber: value });
                    if (errors.phoneNumber) setErrors({...errors, phoneNumber: ''});
                }}
                placeholder="0xxxxxxxxx"
                className={`pl-10 w-full px-4 py-2 rounded-md border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                } focus:ring-2 focus:ring-orange-200 focus:border-orange-400`}
                />
            </div>
            {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select
                value={formData.role}
                onChange={(e) => setFormData({ 
                    ...formData, 
                    role: e.target.value as "Admin" | "User" | "Staff" | "Paid"
                })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Paid">Paid</option>
                </select>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
            <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Enter note about user"
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
                rows={3}
                />
            </div>
            </div>
        </div>

        <div className="flex flex-col items-center justify-start pt-8">
            <div className="mb-8">
            <img 
                src={formData.avatar} 
                alt="User avatar" 
                className="w-48 h-48 rounded-full object-cover bg-white shadow-lg"
            />
            </div>
            <div className="w-full">
            <label className="block text-sm text-gray-600 mb-2">
                Profile Image
            </label>
            <div className="space-y-2">
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => handleAvatarUrlChange(e.target.value)}
                    placeholder="Enter image URL"
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
                </div>
                <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    </div>
                    <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    />
                </label>
                </div>
            </div>
            </div>
        </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:ring-4 focus:ring-orange-200 transition-colors"
          >
            Add User
          </button>
        </div>
    </form>
    </div>
);
};

export default UserManagementAdd;