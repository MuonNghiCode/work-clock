import React, { useState } from "react";
import { X, Mail, Phone, MapPin, Calendar, User2, FileText, ImageIcon } from "lucide-react";

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
phoneNumber: string;
address: string;
birthday: string;
note: string;
role: "Admin" | "User" | "Staff" | "Paid";
avatar: string;
}

interface UserManagementAddProps {
  onClose: () => void;
  onSuccess: (newUser: User) => void;
}

const USERS_STORAGE_KEY = 'workClock_users';

const UserManagementAdd: React.FC<UserManagementAddProps> = ({ onClose, onSuccess }) => {
const [formData, setFormData] = useState<NewUser>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    birthday: "",   
    note: "",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=new"
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    const newUser = {
        ...formData,
        id: crypto.randomUUID(),
        isLocked: false
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...currentUsers, newUser]));
    
    onSuccess(newUser);
    onClose();
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-red-50 border-red-500 transform transition-all duration-300';
    notification.innerHTML = `
        <svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-gray-700 font-medium">Failed to add user</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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
                    onChange={(e) => setFormData({
                    ...formData,
                    name: e.target.value + ' ' + formData.name.split(' ').slice(1).join(' ')
                    })}
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
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
                    onChange={(e) => setFormData({
                    ...formData,
                    name: formData.name.split(' ')[0] + ' ' + e.target.value
                    })}
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
                </div>
            </div>
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
            </div>
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
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
            </div>
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
                rows={3}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
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
            <label className="block text-sm font-medium text-gray-600 mb-2">Avatar URL</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({
                    ...formData,
                    avatar: e.target.value
                })}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Enter image URL"
                />
            </div>
            </div>
        </div>
        </div>

        <div className="flex justify-end mt-6">
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