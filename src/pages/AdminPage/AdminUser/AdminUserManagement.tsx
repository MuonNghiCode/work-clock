import React, { useState } from "react";
import { Search, Edit2, Trash2, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import UserManagementAdd from "../../../components/AdminComponents/AddUser/UserManagementAdd";
import UserManagementEdit from "../../../components/AdminComponents/EditUser/UserManagementEdit";

export interface User {
  id: string;
  user_name: string;
  email: string;
  password: string;
  role_code: string; // A001 to A004
  isLocked: boolean;
}

export interface NewUser {
  user_name: string;
  email: string;
  password: string;
  role_code: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    user_name: "admin_user",
    email: "admin@gmail.com",
    password: "123456",
    role_code: "A001", // Admin
    isLocked: false
  },
  {
    id: "2",
    user_name: "user_test",
    email: "user@gmail.com",
    password: "123456",
    role_code: "A002", // User
    isLocked: false
  },
  {
    id: "3",
    user_name: "staff_test",
    email: "staff@gmail.com",
    password: "123456",
    role_code: "A003", // Staff
    isLocked: true
  },
  {
    id: "4",
    user_name: "paid_test",
    email: "paid@gmail.com", 
    password: "123456",
    role_code: "A004", // Paid
    isLocked: false
  }
];

const USERS_STORAGE_KEY = "workClock_users";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm">
      <div className="fixed inset-0 bg-black/30" onClick={onClose}></div>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg max-w-[800px] w-full shadow-xl 
            transition-all duration-300 ease-out transform 
            animate-[scale-95_0.2s,opacity-0_0.2s] 
            hover:scale-100 hover:opacity-100"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const getRoleName = (roleCode: string): string => {
  switch (roleCode) {
    case 'A001':
      return 'Admin';
    case 'A002':
      return 'User';
    case 'A003':
      return 'Staff';
    case 'A004':
      return 'Paid';
    default:
      return roleCode;
  }
};

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const usersPerPage = 5;
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [lockFilter, setLockFilter] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    // If no search term, show all users that match other filters
    if (!searchTerm) {
      const matchesRole = roleFilter === "all" || user.role_code === roleFilter;
      const matchesLock =
        lockFilter === "all" ||
        (lockFilter === "locked" ? user.isLocked : !user.isLocked);
      return matchesRole && matchesLock;
    }

    // If there is a search term, filter by all criteria
    const matchesSearch = user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role_code === roleFilter;
    const matchesLock =
      lockFilter === "all" ||
      (lockFilter === "locked" ? user.isLocked : !user.isLocked);

    return matchesSearch && matchesRole && matchesLock;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLockToggle = (userId: string) => {
    const userToToggle = users.find((u) => u.id === userId);

    if (userToToggle?.role_code === "A001") {
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-red-50 border-red-500";
      notification.innerHTML = `
        <svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-gray-700 font-medium">Cannot change Admin account status</p>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isLocked: !user.isLocked } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const handleUpdateUser = (updatedUser: User) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id
          ? {
              ...updatedUser,
              password: updatedUser.password || user.password,
            }
          : user
      );
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setIsEditModalOpen(false);

      toast.success("Updated Successfully");
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    try {
      const updatedUsers = users.filter((user) => user.id !== userToDelete);
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };
  const handleAddSuccess = (newUser: NewUser) => {
    setUsers([
      ...users,
      {
        ...newUser,
        id: crypto.randomUUID(),
        isLocked: false,
      },
    ]);

    toast.success("User added successfully");
    setIsAddModalOpen(false);
  };

  return (
    <>
      {/* Changed from w-full lg:w-3/4 to w-full for full-width content */}
      <div className="w-full flex justify-center">
        <div className="w-full flex-col px-6">
          <h1 className="text-5xl !py-9">User Management</h1>

          {/* Search and Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="all">All Roles</option>
                <option value="A001">Admin</option>
                <option value="A002">User</option>
                <option value="A003">Staff</option>
                <option value="A004">Paid</option>
              </select>

              <select
                value={lockFilter}
                onChange={(e) => setLockFilter(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for user..."
                  className="w-[300px] px-4 py-2 border rounded-full pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-sm"
              >
                <span>+</span>
                Create Account
              </button>
            </div>
          </div>

          {/* Table - added full width and overflow handling */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2.5 text-black border-0">
              <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
                <tr className="bg-[#FFB17A]">
                  <th className="border-white px-4 py-2 !rounded-tl-2xl">Username</th>
                  <th className="border-l-2 border-white px-4 py-2">Email</th>
                  <th className="border-l-2 border-white px-4 py-2">Role</th>
                  <th className="border-l-2 border-white px-4 py-2">Lock Account</th>
                  <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">Action</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl">
                    <td className="px-4 py-2 rounded-l-2xl">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">{user.user_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-medium">
                        {getRoleName(user.role_code)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleLockToggle(user.id)}
                        disabled={user.role_code === "A001"}
                        className={`font-medium transition-colors duration-200 px-3 py-1 rounded-full ${
                          user.role_code === "A001"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : user.isLocked
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-green-50 text-green-500 hover:bg-green-100"
                        }`}
                      >
                        {user.role_code === "A001" ? "UNLOCK" : user.isLocked ? "LOCKED" : "UNLOCK"}
                      </button>
                    </td>
                    <td className="px-4 py-2 rounded-r-2xl">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={usersPerPage}
              total={filteredUsers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="!font-squada"
            />
          </div>

          {/* Detail Modal */}
          <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
            {selectedUser && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Account Details</h2>
                  <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Username</p>
                      <p className="font-medium">{selectedUser.user_name}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="font-medium">
                        {getRoleName(selectedUser.role_code)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Account Status</p>
                      <p className={`font-medium ${selectedUser.isLocked ? 'text-red-500' : 'text-green-500'}`}>
                        {selectedUser.isLocked ? 'LOCKED' : 'ACTIVE'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingUser(null);
            }}
          >
            {editingUser && (
              <UserManagementEdit
                user={editingUser}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                onSubmit={handleUpdateUser}
              />
            )}
          </Modal>

          {/* Add User Modal */}
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
            <UserManagementAdd
              onClose={() => setIsAddModalOpen(false)}
              onSuccess={handleAddSuccess}
            />
          </Modal>

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div
                className="fixed inset-0 bg-black/30"
                onClick={() => setShowDeleteConfirm(false)}
              ></div>
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg w-[400px] p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Confirm delete this User
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUserManagement; 