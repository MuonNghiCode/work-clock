import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit2, Trash2, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import UserManagementAdd from "../../../components/AdminComponents/AddUser/UserManagementAdd";
import UserManagementEdit from "../../../components/AdminComponents/EditUser/UserManagementEdit";
import { getUsers, updateUser } from "../../../services/userAuth";
import axiosInstance from "../../../config/axiosUser";

// Định nghĩa interface User dựa trên dữ liệu từ API
export interface User {
  id: string;
  user_id: string; // Thêm _id vì BE trả về cả id và _id
  user_name: string;
  email: string;
  password: string;
  role_code: string; // A001 to A004
  is_blocked: boolean;
  is_verified: boolean;
  is_deleted: boolean;
}

export interface NewUser {
  user_name: string;
  email: string;
  password: string;
  role_code: string;
  is_blocked?: boolean;
  is_verified?: boolean;
}
const mapApiUserToUser = (apiUser: any): User => ({
  id: apiUser._id,
  user_id: apiUser._id, // Optional: keep user_id if needed elsewhere
  user_name: apiUser.user_name,
  email: apiUser.email,
  password: apiUser.password || "", // API might not return password; default to empty string
  role_code: apiUser.role_code,
  is_blocked: apiUser.is_blocked,
  is_verified: apiUser.is_verified,
  is_deleted: apiUser.is_deleted,
});
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
    case "A001":
      return "Admin";
    case "A002":
      return "User";
    case "A003":
      return "Staff";
    case "A004":
      return "Paid";
    default:
      return roleCode;
  }
};

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const usersPerPage = 5;
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Lấy thông tin admin đang đăng nhập từ localStorage
  const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");

  // Di chuyển fetchUsers vào bên trong component
  const fetchUsers = useCallback(
    async (
      searchTerm: string,
      roleFilter: string,
      statusFilter: string,
      currentPage: number,
      usersPerPage: number
    ) => {
      try {
        const searchCondition = {
          keyword: searchTerm,
          role_code: roleFilter !== "all" ? roleFilter : "",
          is_blocked:
            statusFilter === "locked"
              ? true
              : statusFilter === "unlocked"
              ? false
              : undefined,
          is_deleted: statusFilter === "deleted" ? true : false,
        };
        const pageInfo = {
          pageNum: currentPage,
          pageSize: usersPerPage,
        };
        const response = await getUsers(searchCondition, pageInfo);
        if (response.success) {
          const mappedUsers = response.data.pageData.map(mapApiUserToUser);
          setUsers(mappedUsers);
          setTotalItems(response.data.pageInfo.totalItems);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(searchTerm, roleFilter, statusFilter, currentPage, usersPerPage);
  }, [
    searchTerm,
    roleFilter,
    statusFilter,
    currentPage,
    usersPerPage,
    fetchUsers,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateUser = React.useCallback(
    async (updatedUser: User) => {
      try {
        const updateData: {
          email: string;
          user_name: string;
          role_code: string;
          is_blocked: boolean;
          password?: string; // Thêm password là optional
        } = {
          email: updatedUser.email,
          user_name: updatedUser.user_name,
          role_code: updatedUser.role_code,
          is_blocked: updatedUser.is_blocked,
        };

        if (updatedUser.password && updatedUser.password.trim() !== "") {
          updateData.password = updatedUser.password;
        }

        const response = await updateUser(updatedUser.id, updateData);

        if (response.success) {
          const updatedUserFromApi = mapApiUserToUser(response.data);
          setUsers((prev) =>
            prev.map((user) =>
              user.id === updatedUserFromApi.id ? updatedUserFromApi : user
            )
          );
          setIsEditModalOpen(false);
          toast.success("User updated successfully");
        } else {
          toast.error(response.message || "Failed to update user");
        }
      } catch (error: any) {
        console.error("Error updating user:", error);
        toast.error(error.message || "Error updating user");
      }
    },
    [setUsers, setIsEditModalOpen]
  );

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) {
      toast.error("User not found");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/users/${userToDelete.id}`);
      if (response.data.success) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleAddSuccess = async () => {
    try {
      await fetchUsers(
        searchTerm,
        roleFilter,
        "unverified",
        currentPage,
        usersPerPage
      );
      setStatusFilter("unverified");
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error("Error refreshing user list:", error);
      toast.error("Created user but failed to refresh list");
    }
  };

  // Hàm helper để hiển thị trạng thái
  const getUserStatus = (user: User) => {
    if (user.is_deleted) return "Deleted";
    if (!user.is_verified) return "Unverified";
    return user.is_blocked ? "Locked" : "Unlocked";
  };

  const getStatusColor = (user: User) => {
    if (user.is_deleted) return "bg-gray-50 text-gray-500";
    if (!user.is_verified) return "bg-yellow-50 text-yellow-600";
    return user.is_blocked
      ? "bg-red-50 text-red-500"
      : "bg-green-50 text-green-500";
  };

  return (
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
              <option value="deleted">Deleted</option>
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
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
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

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2.5 text-black border-0">
            <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
              <tr className="bg-[#FFB17A]">
                <th className="border-white px-4 py-2 !rounded-tl-2xl">
                  Username
                </th>
                <th className="border-l-2 border-white px-4 py-2">Email</th>
                <th className="border-l-2 border-white px-4 py-2">Role</th>
                <th className="border-l-2 border-white px-4 py-2">Status</th>
                <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {users.map((user, index) => (
                <tr
                  key={`${user.id}-${index}`}
                  className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
                >
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
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                        user
                      )}`}
                    >
                      {getUserStatus(user)}
                    </span>
                  </td>
                  <td className="px-4 py-2 rounded-r-2xl">
                    <div className="flex justify-center gap-4">
                      {!user.is_deleted && (
                        <>
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
                            onClick={() => handleDeleteUser(user)}
                            style={{
                              display:
                                user.email === "admin@gmail.com" ||
                                user.id === currentAdmin._id
                                  ? "none"
                                  : "inline",
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
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
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="!font-squada"
          />
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          {selectedUser && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Account Details</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
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
                    <p
                      className={`font-medium ${
                        selectedUser.is_blocked
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {selectedUser.is_blocked ? "Locked" : "Unlocked"}
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

        {/* Delete Confirmation Modal */}
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
  );
};

export default AdminUserManagement;
