import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { EmployeeInfo } from "../../types/Employee";
import { getEmployeeByUserId } from "../../services/userService";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Home,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getUserById, UserData } from "../../services/userAuth";

const EmployeeInfo: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      setError(null);
      setLoading(true);
      try {
        if (userId) {
          const employeeResponse = await getEmployeeByUserId(userId, true);
          if (employeeResponse.success) {
            setEmployee(employeeResponse.data);
          } else {
            setError("Failed to fetch employee data");
          }

          const userResponse = await getUserById(userId, false);
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
          } else {
            setError("Failed to fetch user data");
          }
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching employee data");
      } finally {
        setLoading(false); 
      }
    };
    fetchEmployeeInfo();
  }, [userId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-orange-light">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-orange-light">
        {" "}
        <div className="text-center mt-10 text-gray-600">
          No Employee Information
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-orange-light">
      {/* Header */}
      <div className="flex items-center justify-between bg-brand-orange text-white px-6 py-4 shadow-md">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold">Account Details</h1>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-10">
        <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-5xl border border-orange-300 flex flex-col gap-6">
          <div className="flex gap-6 w-full">
            {/* User Information with Avatar */}
            <div className="w-1/2 flex flex-col relative bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              {/* Avatar Positioned Above */}
              <div className="absolute -top-16 left-6 w-32 h-32 rounded-full shadow-lg border-4 border-orange-400 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src={employee.avatar_url}
                  alt="Employee Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-xl font-bold text-[#ff914d] mt-16 mb-4">
                Account Information
              </h2>
              <hr className="p-2 text-[#ff914d]" />
              <div className="space-y-4 text-lg">
                <p className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff914d]" />
                  <strong>Username:</strong> {user?.user_name}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#ff914d]" />
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#ff914d]" />
                  <strong>Role:</strong> {user?.role_code}
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#ff914d]" />
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user?.is_verified
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {user?.is_verified ? "Verified" : "Unverified"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#ff914d]" />
                  <strong>Account:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user?.is_blocked
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {" "}
                    {user?.is_blocked ? "Blocked" : "Unlocked"}
                  </span>
                </p>
              </div>
            </div>

            {/* Employee Information */}
            <div className="w-1/2 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#ff914d] mb-4">
                Employee Information
              </h2>
              <hr className="p-2 text-[#ff914d]" />
              <div className="space-y-4 text-lg">
                <p className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff914d]" />
                  <strong>Full Name:</strong> {employee.full_name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#ff914d]" />
                  <strong>Phone:</strong> {employee.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#ff914d]" />
                  <strong>Address:</strong> {employee.address}
                </p>
                <p className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#ff914d]" />
                  <strong>Department:</strong> {employee.department_name} (
                  {employee.department_code})
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#ff914d]" />
                  <strong>Job Rank:</strong> {employee.job_rank}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff914d]" />
                  <strong>Start Date:</strong>{" "}
                  {new Date(employee.start_date).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff914d]" />
                  <strong>End Date:</strong>{" "}
                  {employee.end_date
                    ? new Date(employee.end_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <strong>Salary:</strong> ${employee.salary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
