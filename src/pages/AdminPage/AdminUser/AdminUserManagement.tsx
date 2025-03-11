import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  User,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building,
  Award,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import UserManagementAdd from "../../../components/AdminComponents/AddUser/UserManagementAdd";
import UserManagementEdit from "../../../components/AdminComponents/EditUser/UserManagementEdit";
import {
  deleteUser,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../../../services/userAuth";
import type { UserData } from "../../../services/userAuth";
import { getEmployeeByUserId } from "../../../services/userService";
import EditEmployeeModal from "../../../components/AdminComponents/EditEmployee/EditEmployeeModal";
import { debounce } from "lodash";
import { EmployeeInfo } from "../../../types/Employee";


// ### Interfaces

// User interface
export interface User<T> {
  id: string;
  user_id: string;
  user_name: string;
  email: T;
  password?: string;
  role_code: string;
  is_blocked: boolean;
  is_verified: boolean;
  is_deleted: boolean;
}
export interface NewUser extends Omit<UserData, '_id' | 'is_deleted'> {
  _id?: string;
  is_deleted?: boolean;
}

// Employee interface
// interface Employee {
//   _id: string;
//   user_id: string;
//   job_rank: string;
//   contract_type: string;
//   account: string;
//   address: string;
//   phone: string;
//   full_name: string;
//   avatar_url: string;
//   department_code: string;
//   salary: number;
//   start_date: string | null;
//   end_date: string | null;
//   updated_by: string;
//   created_at: string;
//   updated_at: string;
//   is_deleted: boolean;
// }

// API User response interface
interface ApiUser {
  _id: string;
  user_name: string;
  email: string;
  password?: string;
  role_code: string;
  is_blocked: boolean;
  is_verified: boolean;
  is_deleted: boolean;
}

// ### Utility Functions

const mapApiUserToUser = (apiUser: ApiUser): User<string> => ({
  id: apiUser._id,
  user_id: apiUser._id,
  user_name: apiUser.user_name,
  email: apiUser.email,
  password: apiUser.password || "",
  role_code: apiUser.role_code,
  is_blocked: apiUser.is_blocked,
  is_verified: apiUser.is_verified,
  is_deleted: apiUser.is_deleted,
});

// ### Animated Modal Component

const AnimatedModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out"
      style={{ opacity: isAnimating ? 1 : 0 }}
    >
      <div
        className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out"
        style={{ opacity: isAnimating ? 1 : 0 }}
        onClick={onClose}
      ></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg max-w-[800px] w-full shadow-xl transition-all duration-300 ease-in-out transform"
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "scale(1)" : "scale(0.95)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// ### Role Name Mapping

const getRoleName = (roleCode: string): string => {
  switch (roleCode) {
    case "A001":
      return "Admin";
    case "A002":
      return "Finance";
    case "A003":
      return "Approval";
    case "A004":
      return "Claimer";
    default:
      return roleCode;
  }
};

// ### Status Badge Component

const StatusBadge: React.FC<{ type: "role" | "status"; value: string }> = ({
  type,
  value,
}) => {
  if (type === "role") {
    const roleColors: Record<string, string> = {
      A001: "bg-purple-100 text-purple-700",
      A002: "bg-orange-100 text-orange-700",
      A003: "bg-blue-100 text-blue-700",
      A004: "bg-green-100 text-green-700",
      default: "bg-gray-100 text-gray-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full font-medium ${roleColors[value] || roleColors.default
          }`}
      >
        {getRoleName(value)}
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
      {value}
    </span>
  );
};

// ### Main Component: AdminUserManagement

const AdminUserManagement: React.FC = () => {
  // ### State Declarations
  const [users, setUsers] = useState<User<string>[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User<string> | null>(null);
  const [editingUser, setEditingUser] = useState<User<string> | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User<string> | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInfo
    | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<"account" | "information">("account");
  const [editingEmployee, setEditingEmployee] = useState<EmployeeInfo | null>(null);
  const [employeeCache, setEmployeeCache] = useState<Record<string, EmployeeInfo>>({});
  const [openRoleDropdowns, setOpenRoleDropdowns] = useState<Record<string, boolean>>({});
  const [showUserId, setShowUserId] = useState(false);
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string, newRole: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");

  // ### Handlers and Fetch Functions

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value.trim());
      setCurrentPage(1);
    }, 500),
    []
  );

  const fetchUsers = useCallback(
    async (
      searchTerm: string,
      roleFilter: string,
      statusFilter: string,
      currentPage: number,
      usersPerPage: number
    ) => {
      try {
        setIsLoading(true);
        const searchCondition = {
          keyword: searchTerm,
          role_code: roleFilter !== "all" ? roleFilter : "",
          is_blocked:
            statusFilter === "locked"
              ? true
              : statusFilter === "unlocked"
                ? false
                : undefined,
          is_verified:
            statusFilter === "verified"
              ? true
              : statusFilter === "unverified"
                ? false
                : undefined,
          search_by: "username" as const,
        };
        const pageInfo = {
          pageNum: currentPage,
          pageSize: usersPerPage,
        };
        const response = await getUsers(searchCondition, pageInfo);
        if (response.success && response.data) {
          const mappedUsers = response.data.pageData.map((user: UserData) =>
            mapApiUserToUser(user as ApiUser)
          );
          setUsers(mappedUsers);
          setTotalItems(response.data.pageInfo.totalItems ?? 0);
        }
      } catch (error: unknown) {
        console.error("Error fetching users:", error);
        if (error instanceof Error && error.message.includes("403")) {
          toast.error("Access denied: invalid token!");
        } else {
          toast.error("Failed to fetch users.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(searchTerm, roleFilter, statusFilter, currentPage, usersPerPage);
  }, [searchTerm, roleFilter, statusFilter, currentPage, usersPerPage, fetchUsers]);

  const handleUpdateUser = async (updatedUser: User<string>) => {
    try {
      setIsLoading(true);
      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(updatedUser);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: User<string>) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) {
      toast.error("User not found");
      return;
    }

    try {
      setIsLoading(true);
      const response = await deleteUser(userToDelete.id);
      if (response.success) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        toast.success("User deleted successfully");
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuccess = async () => {
    try {
      setIsLoading(true);
      await fetchUsers(
        searchTerm,
        roleFilter,
        "unverified",
        currentPage,
        usersPerPage
      );
      setStatusFilter("unverified");
      setIsAddModalOpen(false);
    } catch (error: unknown) {
      console.error("Error refreshing user list:", error);
      toast.error("Created user but failed to refresh list");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeData = async (userId: string): Promise<EmployeeInfo | null> => {
    try {
      if (employeeCache[userId]) {
        return employeeCache[userId];
      }
      const response = await getEmployeeByUserId(userId);
      if (response && response.success && response.data) {
        setEmployeeCache((prev) => ({
          ...prev,
          [userId]: response.data,
        }));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Failed to fetch employee data");
      return null;
    }
  };

  const handleViewUserDetails = async (user: User<string>) => {
    setSelectedUser(user);
    try {
      const employeeData = await fetchEmployeeData(user.id);
      setSelectedEmployee(employeeData);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setSelectedEmployee(null);
    }
    setIsDetailModalOpen(true);
  };

  const handleEdit = async (user: User<string>) => {
    setEditingUser(user);

    try {
      setIsLoading(true);

      // Tạo employee mặc định
      const defaultEmployee = {
        _id: "",
        user_id: user.id,
        job_rank: "",
        contract_type: "",
        account: user.user_name,
        address: "",
        phone: "",
        full_name: user.user_name,
        avatar_url: "",
        department_code: "",
        salary: 0,
        start_date: "",
        end_date: "",
        updated_by: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
        department_name: ""
      };

      // Gọi API để lấy thông tin employee
      const response = await getEmployeeByUserId(user.id);

      if (response.success && response.data) {
        // Lưu vào cache và state - Chỉ lấy phần data từ response
        setEmployeeCache(prev => ({ ...prev, [user.id]: response.data }));
        setEditingEmployee(response.data);
      } else {
        // Sử dụng employee mặc định nếu không có dữ liệu
        console.log("Using default employee object for user:", user);
        setEditingEmployee(defaultEmployee);
      }

      // Mở modal
      setIsEditModalOpen(true);
      setActiveEditTab("account"); // Mặc định hiển thị tab account
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to load employee data");

      // Tạo employee mặc định nếu có lỗi
      const defaultEmployee = {
        _id: "",
        user_id: user.id,
        job_rank: "",
        contract_type: "",
        account: user.user_name,
        address: "",
        phone: "",
        full_name: user.user_name,
        avatar_url: "",
        department_code: "",
        salary: 0,
        start_date: "",
        end_date: "",
        updated_by: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
        department_name: ""
      };

      setEditingEmployee(defaultEmployee);
      setIsEditModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeUpdateSuccess = (updatedEmployee: EmployeeInfo) => {
    setEmployeeCache((prev) => ({
      ...prev,
      [updatedEmployee.user_id]: updatedEmployee,
    }));
    if (editingEmployee && editingEmployee.user_id === updatedEmployee.user_id) {
      setEditingEmployee(updatedEmployee);
    }
    if (selectedEmployee && selectedEmployee.user_id === updatedEmployee.user_id) {
      setSelectedEmployee(updatedEmployee);
    }
    toast.success("Employee updated successfully");
  };

  const handleToggleStatus = async (user: User<string>) => {
    try {
      if (user.email === "admin@gmail.com" || user.id === currentAdmin._id) {
        toast.warning("Cannot change status of this account");
        return;
      }
      const newStatus = !user.is_blocked;
      const response = await updateUserStatus(user.id, newStatus);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_blocked: newStatus } : u
          )
        );
        if (statusFilter === "all") {
          setStatusFilter(newStatus ? "locked" : "unlocked");
        } else if (
          (newStatus && statusFilter === "unlocked") ||
          (!newStatus && statusFilter === "locked")
        ) {
          fetchUsers(
            searchTerm,
            roleFilter,
            statusFilter,
            currentPage,
            usersPerPage
          );
        }
        toast.success(`User ${newStatus ? "blocked" : "unblocked"} successfully`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update user status");
      }
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setPendingRoleChange({ userId, newRole });
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      setIsLoading(true);
      const response = await updateUserRole(
        pendingRoleChange.userId,
        pendingRoleChange.newRole
      );

      if (response.success) {
        toast.success("User role updated successfully");
        fetchUsers(searchTerm, roleFilter, statusFilter, currentPage, usersPerPage);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setShowRoleConfirm(false);
      setPendingRoleChange(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenRoleDropdowns({});
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ### JSX Render

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
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                className="w-[300px] px-4 py-2 border rounded-full pr-10"
                defaultValue={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                    <div className="relative">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newOpenDropdowns = { ...openRoleDropdowns };
                          newOpenDropdowns[user.id] =
                            !openRoleDropdowns[user.id];
                          setOpenRoleDropdowns(newOpenDropdowns);
                        }}
                      >
                        <StatusBadge type="role" value={user.role_code} />
                        <Shield size={16} className="ml-1 text-gray-400" />
                      </div>

                      {openRoleDropdowns[user.id] && (
                        <div
                          className="absolute z-10 bg-white shadow-lg rounded-md p-2 mt-1 left-1/2 transform -translate-x-1/2"
                          style={{ minWidth: "120px" }}
                        >
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => {
                                handleRoleChange(user.id, "A001");
                                const newOpenDropdowns = {
                                  ...openRoleDropdowns,
                                };
                                newOpenDropdowns[user.id] = false;
                                setOpenRoleDropdowns(newOpenDropdowns);
                              }}
                              className="px-3 py-1 text-left hover:bg-gray-100 rounded text-sm"
                            >
                              Admin
                            </button>
                            <button
                              onClick={() => {
                                handleRoleChange(user.id, "A002");
                                const newOpenDropdowns = {
                                  ...openRoleDropdowns,
                                };
                                newOpenDropdowns[user.id] = false;
                                setOpenRoleDropdowns(newOpenDropdowns);
                              }}
                              className="px-3 py-1 text-left hover:bg-gray-100 rounded text-sm"
                            >
                              Finance
                            </button>
                            <button
                              onClick={() => {
                                handleRoleChange(user.id, "A003");
                                const newOpenDropdowns = {
                                  ...openRoleDropdowns,
                                };
                                newOpenDropdowns[user.id] = false;
                                setOpenRoleDropdowns(newOpenDropdowns);
                              }}
                              className="px-3 py-1 text-left hover:bg-gray-100 rounded text-sm"
                            >
                              Approval
                            </button>
                            <button
                              onClick={() => {
                                handleRoleChange(user.id, "A004");
                                const newOpenDropdowns = {
                                  ...openRoleDropdowns,
                                };
                                newOpenDropdowns[user.id] = false;
                                setOpenRoleDropdowns(newOpenDropdowns);
                              }}
                              className="px-3 py-1 text-left hover:bg-gray-100 rounded text-sm"
                            >
                              Claimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.is_blocked ? (
                        <div className="flex items-center text-red-500 hover:text-red-600">
                          <Lock size={16} className="mr-1" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-500 hover:text-green-600">
                          <Unlock size={16} className="mr-1" />
                          <span>Unlocked</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 rounded-r-2xl">
                    <div className="flex justify-center gap-4">
                      {!user.is_deleted && (
                        <>
                          <button
                            className="text-blue-500 hover:text-blue-600"
                            onClick={() => {
                              handleEdit(user);
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
                        onClick={() => handleViewUserDetails(user)}
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
        <div className="flex items-center justify-end gap-2 mt-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={usersPerPage}
            onChange={(page) => {
              setCurrentPage(page);
            }}
            showSizeChanger={true}
            pageSizeOptions={["5", "10", "20"]}
            onShowSizeChange={(_, size) => {
              setUsersPerPage(size);
              setCurrentPage(1);
            }}
            className="custom-pagination"
            size="small"
            showTotal={() => ""}
          />
        </div>

        {/* Detail Modal */}
        <AnimatedModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          {selectedUser && (
            <div className="p-8 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#FF9447]">
                  Account Details
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-10">
                {/* Left Column - Employee Avatar and Account Info */}
                <div className="flex flex-col">
                  <div className="flex items-start mb-6">
                    {selectedEmployee?.avatar_url ? (
                      <img
                        src={selectedEmployee.avatar_url}
                        alt={selectedEmployee.full_name || selectedUser.user_name}
                        className="w-28 h-28 rounded-lg object-cover mr-6 shadow-md"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-lg bg-white flex items-center justify-center mr-6 shadow-md text-[#FF9447] border border-gray-200">
                        <User size={40} />
                      </div>
                    )}
                    <div className="mt-2">
                      <h3 className="text-2xl font-bold text-[#FF9447] mb-1 truncate max-w-[200px]">
                        {selectedEmployee?.full_name || selectedUser.user_name}
                      </h3>
                      <p className="text-[#FF9447] font-medium mb-2 flex items-center">
                        <Award size={16} className="mr-2 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {selectedEmployee?.job_rank ||
                            getRoleName(selectedUser.role_code)}
                        </span>
                      </p>
                      <p className="text-gray-500 flex items-center">
                        <Building size={16} className="mr-2 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {selectedEmployee?.department_code || "No department"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                    <h4 className="text-lg font-semibold text-[#FF9447] mb-4 border-b pb-2">
                      Account Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Shield
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          User ID:
                        </span>
                        <div className="w-2/3 flex items-center gap-2">
                          <span className="text-gray-800 truncate">
                            {showUserId ? selectedUser.id : '••••••••••••••••'}
                          </span>
                          <button
                            onClick={() => setShowUserId(!showUserId)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            {showUserId ? (
                              <Unlock className="h-4 w-4 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <User
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Username:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedUser.user_name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Email:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedUser.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Shield
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Role:
                        </span>
                        <span className="w-2/3 text-gray-800">
                          {getRoleName(selectedUser.role_code)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Status:
                        </span>
                        <span className="w-2/3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${selectedUser.is_verified
                                ? "bg-green-50 text-green-600"
                                : "bg-yellow-50 text-yellow-600"
                              }`}
                          >
                            {selectedUser.is_verified
                              ? "Verified"
                              : "Unverified"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Account:
                        </span>
                        <span className="w-2/3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${selectedUser.is_blocked
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                              }`}
                          >
                            {selectedUser.is_blocked ? "Blocked" : "Unlocked"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Employee Details */}
                <div>
                  <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                    <h4 className="text-lg font-semibold text-[#FF9447] mb-4 border-b pb-2">
                      Employee Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Full Name:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.full_name || ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Phone:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.phone || ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Address:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.address || ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Contract:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.contract_type || ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Start Date:
                        </span>
                        <span className="w-2/3 text-gray-800">
                          {selectedEmployee?.start_date
                            ? new Date(
                              selectedEmployee.start_date
                            ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          End Date:
                        </span>
                        <span className="w-2/3 text-gray-800">
                          {selectedEmployee?.end_date
                            ? new Date(
                              selectedEmployee.end_date
                            ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Building
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Department:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.department_code || ""}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Award
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Job Rank:
                        </span>
                        <span className="w-2/3 text-gray-800 truncate">
                          {selectedEmployee?.job_rank || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2 bg-[#FFB17A] text-white rounded-md hover:bg-[#FF947] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* Edit Modal */}
        <AnimatedModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
        >
          {editingUser && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-[#FF9447]">
                    {activeEditTab === "account"
                      ? "Edit Account"
                      : "Edit Information"}
                  </h2>
                  <button
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${activeEditTab === "account"
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-[#FF9447] text-white hover:bg-[#FF8347]"
                      }`}
                    onClick={() =>
                      setActiveEditTab(
                        activeEditTab === "account" ? "information" : "account"
                      )
                    }
                  >
                    {activeEditTab === "account" ? (
                      <ArrowRight size={20} />
                    ) : (
                      <ArrowLeft size={20} />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="relative">
                <div
                  className={`transition-all duration-300 transform ${activeEditTab === "account"
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-full opacity-0 absolute inset-0"
                    }`}
                >
                  {activeEditTab === "account" && (
                    <UserManagementEdit
                      user={editingUser}
                      onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingUser(null);
                      }}
                      onSubmit={handleUpdateUser}
                    />
                  )}
                </div>
                <div
                  className={`transition-all duration-300 transform ${activeEditTab === "information"
                      ? "translate-x-0 opacity-100"
                      : "translate-x-full opacity-0 absolute inset-0"
                    }`}
                >
                  {activeEditTab === "information" && (
                    <EditEmployeeModal
                      isOpen={true}
                      onClose={() => {
                        setActiveEditTab("account");
                      }}
                      employee={editingEmployee}
                      isEmbedded={true}
                      onUpdateSuccess={handleEmployeeUpdateSuccess}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </AnimatedModal>

        {/* Add User Modal */}
        <AnimatedModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        >
          <UserManagementAdd
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddSuccess}
          />
        </AnimatedModal>

        {/* Delete Confirmation Modal */}
        <AnimatedModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        >
          <div className="p-6">
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
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </AnimatedModal>

        <EditEmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          employee={selectedEmployee}
        />

        {/* Role Confirmation Modal */}
        <AnimatedModal
          isOpen={showRoleConfirm}
          onClose={() => setShowRoleConfirm(false)}
        >
          <div className="p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Role Change
              </h3>
              <p className="text-gray-500 text-center">
                Are you sure you want to change this user's role?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </AnimatedModal>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;