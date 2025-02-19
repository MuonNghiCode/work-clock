import React from "react";
import { X, Mail, Phone, MapPin, Calendar, User2, FileText, ImageIcon, Lock, UserCog, Eye, EyeOff } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  note: string;
  role: "Admin" | "User" | "Staff" | "Paid";
  isLocked: boolean;
  avatar: string;
  password: string;
}

interface UserManagementEditProps {
  user: User;
  onClose: () => void;
  onSubmit: (updatedUser: User) => void;
} 

const UserManagementEdit: React.FC<UserManagementEditProps> = ({
  user,
  onClose,
  onSubmit,
}) => {
  const [editingUser, setEditingUser] = React.useState(user);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate email
    if (!editingUser.email) {
      newErrors.email = "Email is required";
    } else if (!editingUser.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password only if it's changed
    if (editingUser.password && editingUser.password !== user.password) {
      if (editingUser.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit(editingUser);
  };

  // Thêm hàm xử lý file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingUser({
          ...editingUser,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Edit Profile</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={editingUser.name.split(" ")[0]}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value + " " + editingUser.name.split(" ").slice(1).join(" "),
                      })
                    }
                    placeholder="Enter first name"
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
                    value={editingUser.name.split(" ").slice(1).join(" ")}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: editingUser.name.split(" ")[0] + " " + e.target.value,
                      })
                    }
                    placeholder="Enter last name"
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* Other Fields */}
            <InputField
              label="Email"
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              value={editingUser.email}
              onChange={(value) => setEditingUser({ ...editingUser, email: value })}
              placeholder="example@gmail.com"
            />
             {/* Password */}
             <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={editingUser.password}
                  onChange={(e) => {
                    setEditingUser({
                      ...editingUser,
                      password: e.target.value,
                    });
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
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
            <InputField
              label="Contact Number"
              icon={<Phone className="h-4 w-4 text-gray-400" />}
              value={editingUser.phoneNumber}
              onChange={(value) => setEditingUser({ ...editingUser, phoneNumber: value })}
              placeholder="0xxxxxxxxx"
            />

            <InputField
              label="Address"
              icon={<MapPin className="h-4 w-4 text-gray-400" />}
              value={editingUser.address}
              onChange={(value) => setEditingUser({ ...editingUser, address: value })}
              placeholder="Enter address"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Birthday"
                icon={<Calendar className="h-4 w-4 text-gray-400" />}
                type="date"
                value={editingUser.birthday}
                onChange={(value) => setEditingUser({ ...editingUser, birthday: value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCog className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as "Admin" | "User" | "Staff" | "Paid",
                      })
                    }
                    className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lock Status */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
              <button
                type="button"
                onClick={() =>
                  setEditingUser({
                    ...editingUser,
                    isLocked: !editingUser.isLocked,
                  })
                }
                disabled={editingUser.role === "Admin"}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  editingUser.role === "Admin"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : editingUser.isLocked
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-green-50 text-green-500 hover:bg-green-100"
                }`}
              >
                {editingUser.isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>LOCKED</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>UNLOCK</span>
                  </>
                )}
              </button>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={editingUser.note}
                  onChange={(e) => setEditingUser({ ...editingUser, note: e.target.value })}
                  placeholder="Enter note about user"
                  className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
                  rows={3}
                />
              </div>
            </div>

           
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-start pt-8">
            <img 
              src={editingUser.avatar} 
              alt="" 
              className="w-32 h-32 rounded-full mb-4 object-cover bg-white shadow-lg" 
            />
            <div className="w-full space-y-4">
              <InputField
                label="Image URL"
                icon={<ImageIcon className="h-4 w-4 text-gray-400" />}
                value={editingUser.avatar}
                onChange={(value) => setEditingUser({ ...editingUser, avatar: value })}
                placeholder="Enter image URL"
              />
              
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
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper component for input fields
const InputField: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
      />
    </div>
  </div>
);

export default UserManagementEdit; 