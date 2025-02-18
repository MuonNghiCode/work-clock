import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye, X, User2 } from "lucide-react";
import UserManagementAdd from "../../../components/AdminComponents/AddUser/UserManagementAdd";

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
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "David",
    email: "abc@gmail.com",
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

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesLock =
      lockFilter === "all" ||
      (lockFilter === "locked" ? user.isLocked : !user.isLocked);

    return matchesSearch && matchesRole && matchesLock;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleLockToggle = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isLocked: !user.isLocked } : user
    );
    setUsers(updatedUsers);
  };

  const handleUpdateUser = (updatedUser: User) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setIsEditModalOpen(false);

      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-green-50 border-green-500 transform transition-all duration-300";
      notification.innerHTML = `
        <svg class="text-green-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"/>
        </svg>
        <p class="text-gray-700 font-medium">User updated successfully</p>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-red-50 border-red-500 transform transition-all duration-300";
      notification.innerHTML = `
        <svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-gray-700 font-medium">Failed to update user</p>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-green-50 border-green-500 transform transition-all duration-300";
        notification.innerHTML = `
          <svg class="text-green-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"/>
          </svg>
          <p class="text-gray-700 font-medium">User deleted successfully</p>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-red-50 border-red-500 transform transition-all duration-300";
        notification.innerHTML = `
          <svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-gray-700 font-medium">Failed to delete user</p>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      handleUpdateUser(editingUser);
    }
  };

  const handleAddSuccess = (newUser: User) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);

    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 p-4 rounded-lg border shadow-lg flex items-center gap-3 z-50 bg-green-50 border-green-500 transform transition-all duration-300";
    notification.innerHTML = `
      <svg class="text-green-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"/>
      </svg>
      <p class="text-gray-700 font-medium">User added successfully</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-squada">User Management</h1>
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? "bg-[#FFB17A] text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {page}
            </button>
          ))}
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
                  className={`font-medium ${
                    user.isLocked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {user.isLocked ? "LOCKED" : "UNLOCK"}
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
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        First Name
                      </label>
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
                              name:
                                e.target.value +
                                " " +
                                editingUser.name.split(" ").slice(1).join(" "),
                            })
                          }
                          className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Last Name
                      </label>
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
                              name:
                                editingUser.name.split(" ")[0] +
                                " " +
                                e.target.value,
                            })
                          }
                          className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={editingUser.phoneNumber}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editingUser.address}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          address: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Birthday
                    </label>
                    <input
                      type="date"
                      value={editingUser.birthday}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          birthday: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Role
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value as
                            | "Admin"
                            | "User"
                            | "Staff"
                            | "Paid",
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Account Status
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingUser({
                          ...editingUser,
                          isLocked: !editingUser.isLocked,
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editingUser.isLocked
                          ? "bg-red-100 text-red-500 hover:bg-red-200"
                          : "bg-green-100 text-green-500 hover:bg-green-200"
                      }`}
                    >
                      {editingUser.isLocked ? "LOCKED" : "UNLOCK"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Note
                    </label>
                    <textarea
                      value={editingUser.note}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, note: e.target.value })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-start pt-8">
                  <img
                    src={editingUser.avatar}
                    alt=""
                    className="w-32 h-32 rounded-full"
                  />
                  <div className="w-full space-y-2">
                    <label className="block text-sm text-gray-600">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editingUser.avatar}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          avatar: e.target.value,
                        })
                      }
                      placeholder="Enter image URL"
                      className="w-full p-2 border rounded focus:outline-none focus:border-[#FFB17A]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#FFB17A] text-white rounded-full hover:bg-[#FF9147]"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <UserManagementAdd
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newUser) => {
            handleAddSuccess(newUser);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminUserManagement;
