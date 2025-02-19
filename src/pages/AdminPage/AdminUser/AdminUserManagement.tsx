import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import UserManagementAdd from "../../../components/AdminComponents/AddUser/UserManagementAdd";
import UserManagementEdit from "../../../components/AdminComponents/EditUser/UserManagementEdit";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  note: string;
  role: "Admin" | "User" | "Staff" | "Paid";
  isLocked: boolean;
  avatar: string;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  note: string;
  role: "Admin" | "User" | "Staff" | "Paid";
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "David",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 123456789",
    address: "123 Main St, City",
    birthday: "1990-01-01",
    note: "Senior Developer",
    role: "Admin",
    isLocked: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: "2",
    name: "Mike",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 987654321",
    address: "456 Oak St, Town",
    birthday: "1992-05-15",
    note: "Project Manager",
    role: "User",
    isLocked: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    id: "3",
    name: "Nina",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 555666777",
    address: "789 Pine St, Village",
    birthday: "1995-12-25",
    note: "UI Designer",
    role: "Staff",
    isLocked: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
  {
    id: "4",
    name: "Nina",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 999888777",
    address: "321 Elm St, District",
    birthday: "1988-07-30",
    note: "Team Lead",
    role: "Staff",
    isLocked: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  },
  {
    id: "5",
    name: "David",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 111222333",
    address: "654 Maple St, Area",
    birthday: "1993-03-20",
    note: "Frontend Developer",
    role: "Paid",
    isLocked: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  },
  {
    id: "6",
    name: "David",
    email: "abc@gmail.com",
    password: "123456",
    phoneNumber: "+84 444555666",
    address: "987 Cedar St, Zone",
    birthday: "1991-09-10",
    note: "Backend Developer",
    role: "Paid",
    isLocked: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
  },
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

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : mockUsers;
  });
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
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
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

    if (userToToggle?.role === "Admin") {
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
        user.id === updatedUser.id ? { ...updatedUser } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setIsEditModalOpen(false);

      toast.success("Updated Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    } catch {
      toast.error("Failed to update user", {
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

      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    } catch {
      toast.error("Failed to delete user", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
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
        avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${crypto.randomUUID()}`
      },
    ]);

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold font-squada">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-sm"
        >
          <span>+</span>
          Add User
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Staff">Staff</option>
            <option value="Paid">Paid</option>
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

        <div className="relative">
          <input
            type="text"
            placeholder="Search for user..."
            className="w-[300px] px-4 py-2 border rounded-full pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="bg-transparent">
        <div className="bg-[#FFB17A] text-white rounded-t-lg px-4 py-3 grid grid-cols-5 gap-4">
          <div>User Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Lock Account</div>
          <div>Action</div>
        </div>

        <div className="space-y-2 mt-2">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg px-4 py-3 grid grid-cols-5 gap-4 items-center"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                {user.name}
              </div>
              <div>{user.email}</div>
              <div>{user.role}</div>
              <div>
                <button
                  onClick={() => handleLockToggle(user.id)}
                  disabled={user.role === "Admin"}
                  className={`font-medium transition-colors duration-200 px-3 py-1 rounded ${
                    user.role === "Admin"
                      ? "text-gray-400 cursor-not-allowed"
                      : user.isLocked
                      ? "text-red-500 hover:bg-red-200"
                      : "text-green-500 hover:bg-green-200"
                  }`}
                >
                  {user.role === "Admin"
                    ? "UNLOCK"
                    : user.isLocked
                    ? "LOCKED"
                    : "UNLOCK"}
                </button>
              </div>
              <div className="flex gap-4">
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
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedUser.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{selectedUser.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Birthday</p>
                  <p>{selectedUser.birthday}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Note</p>
                <p className="bg-gray-50 p-2 rounded">{selectedUser.note}</p>
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
  );
};

export default AdminUserManagement;
