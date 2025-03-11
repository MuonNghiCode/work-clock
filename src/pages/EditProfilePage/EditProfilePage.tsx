import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "antd";
// Sử dụng icon cho password (bạn có thể cài react-icons nếu chưa có: npm install react-icons)
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Thêm icon camera
// Import ảnh mặc định
//import { UserContext } from "../../context/UserContext"; // Import UserContext
import { changePassword, getAllJobs, getEmployeeByUserId, updateEmployee } from "../../services/userService";
import { getAllDepartments } from "../../services/userService";
import { getAllContracts } from "../../services/userService";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeInfo, JobRank } from "../../types/Employee";
import { User } from "lucide-react";
import ImageUploader from "../../components/ImageUploader/ImageUploader";



export interface Department {
    _id: string;
    department_code: string;
    description: string;
}

export interface Contract {
    _id: string;
    contract_type: string;
    description: string;
}

interface PasswordData extends Record<string, string> {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
interface FormData {
    job_rank: string;
    contract_type: string;
    account: string;
    address: string;
    phone: string;
    department_name: string;
    full_name: string;
    avatar_url: string;
    department_code: string;
    salary: number;
    user_id: string;
    is_deleted: boolean;
    start_date: Date | null;
    end_date: Date | null;
    updated_by: string;
}


const EditProfilePage: React.FC = () => {

    const [formData, setFormData] = useState<FormData>({
        job_rank: "",
        user_id: "",
        contract_type: "",
        account: "",
        address: "",
        phone: "",
        department_name: "",
        full_name: "",
        avatar_url: "",
        department_code: "",
        salary: 0,
        start_date: null,
        end_date: null,
        is_deleted: false,
        updated_by: "",
    });

    const [activeTab, setActiveTab] = useState<"account" | "password">("account");

    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [userId, setUserId] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [jobrank, setJobRank] = useState<JobRank[]>([]);
    const [previewAvatar, setPreviewAvatar] = useState("");
    // Lấy userId từ localStorage sau khi đăng nhập
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Gọi API lấy thông tin nhân viên khi có userId
    useEffect(() => {
        if (userId) {
            getEmployeeByUserId(userId)
                .then((response) => {
                    if (response.success) {
                        const data = response.data;
                        setFormData({
                            job_rank: data.job_rank,
                            user_id: userId,
                            contract_type: data.contract_type,
                            account: data.account,
                            address: data.address,
                            phone: data.phone,
                            full_name: data.full_name,
                            avatar_url: data.avatar_url || "",
                            is_deleted: data.is_deleted,
                            updated_by: data.updated_by,
                            department_name: data.department_name,
                            department_code: data.department_code,
                            salary: data.salary,
                            start_date: data.start_date ? new Date(data.start_date) : null,
                            end_date: data.end_date ? new Date(data.end_date) : null,
                        });
                    } else {
                        console.error("Error fetching employee data:", response.message);
                    }
                })
                .catch((error) => console.error("Error fetching employee data:", error));
        }
    }, [userId]);
    // State cho ảnh đại diện
    // Lấy dropdown data cho Department và Contract
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const deptData = await getAllDepartments();
                const contractData = await getAllContracts();
                const jobRankData = await getAllJobs();
                setJobRank(jobRankData.data);
                setDepartments(deptData.data);
                setContracts(contractData.data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);
    // Xử lý thay đổi ngày cho Start Date
    const handleStartDateChange = (date: Dayjs) => {
        setFormData((prev) => ({
            ...prev,
            start_date: date.toDate(), // Chuyển từ Dayjs sang Date
        }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const storedUserId = localStorage.getItem("userId");

        if (!storedUserId) {
            toast.error("User ID is missing");
            return;
        }

        const formattedData: EmployeeInfo = {
            ...formData,
            start_date: formData.start_date ? formData.start_date.toISOString() : "",
            end_date: formData.end_date ? formData.end_date.toISOString() : null,
        };

        try {
            await updateEmployee(storedUserId, formattedData);
            localStorage.setItem("accountData", JSON.stringify(formattedData));
            toast.success("Employee updated successfully!");

            // Refresh the employee data
            const updatedEmployeeData = await getEmployeeByUserId(storedUserId);
            setFormData({
                job_rank: updatedEmployeeData.data.job_rank,
                user_id: storedUserId,
                contract_type: updatedEmployeeData.data.contract_type,
                account: updatedEmployeeData.data.account,
                address: updatedEmployeeData.data.address,
                phone: updatedEmployeeData.data.phone,
                full_name: updatedEmployeeData.data.full_name,
                avatar_url: updatedEmployeeData.data.avatar_url || "",
                is_deleted: updatedEmployeeData.data.is_deleted,
                updated_by: updatedEmployeeData.data.updated_by,
                department_name: updatedEmployeeData.data.department_name,
                department_code: updatedEmployeeData.data.department_code,
                salary: updatedEmployeeData.data.salary,
                start_date: updatedEmployeeData.data.start_date ? new Date(updatedEmployeeData.data.start_date) : null,
                end_date: updatedEmployeeData.data.end_date ? new Date(updatedEmployeeData.data.end_date) : null,
            });
        } catch (error) {
            console.error("Error updating employee:", error);
            toast.error("Error updating employee");
        }
    };


    const [showPassword, setShowPassword] = useState<Record<keyof PasswordData, boolean>>({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const validateImageUrl = async (url: string) => {
        try {
            const img = new Image();
            img.onload = () => {
                setPreviewAvatar(url);
                setFormData((prev) => ({ ...prev, avatar_url: url }));
            };
            img.onerror = () => {
                setPreviewAvatar("");
                toast.error("Invalid image URL");
            };
            img.src = url;
        } catch {
            setPreviewAvatar("");
            toast.error("Invalid image URL");
        }
    };

    const handleImageUpload = (imageUrl: string) => {
        setPreviewAvatar(imageUrl);
        setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
    };

    // Submit cho Change Password
    const handleSubmitPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra mật khẩu xác nhận
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Confirm password does not match!");
            return;
        }

        try {
            const response = await changePassword(passwordData.oldPassword, passwordData.newPassword);
            if (response.success) {
                toast.success("Password changed successfully!");
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Reset form
            } else {
                toast.error(response.message || "Failed to change password.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    // Toggle show/hide password cho các field
    const toggleShowPassword = (field: keyof PasswordData) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* ToastContainer để hiển thị thông báo */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="flex gap-6 bg-white shadow rounded-lg p-6">
                {/* Sidebar: User Profile */}

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Image</h3>
                    <div className="flex flex-col items-center gap-4">
                        {/* Avatar Preview với Upload Overlay */}
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden">
                                {previewAvatar ? (
                                    <img
                                        src={previewAvatar}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageUploader onImageUploaded={handleImageUpload} />
                            </div>
                        </div>

                        {/* URL Input và Preview Button */}
                        <div className="w-full max-w-md">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Image URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.avatar_url || ""}
                                    onChange={(e) => validateImageUrl(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF9447] focus:border-[#FF9447]"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <button
                                    type="button"
                                    onClick={() => validateImageUrl(formData.avatar_url || "")}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-3/4">
                    {/* Tabs */}
                    <div className="mb-4 border-b">
                        <nav className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab("account")}
                                className={`pb-2 font-semibold ${activeTab === "account"
                                    ? "border-b-2 border-orange-500 text-orange-500"
                                    : "text-gray-500 hover:text-orange-500"
                                    }`}
                            >
                                Account Settings
                            </button>
                            <button
                                onClick={() => setActiveTab("password")}
                                className={`pb-2 font-semibold ${activeTab === "password"
                                    ? "border-b-2 border-orange-500 text-orange-500"
                                    : "text-gray-500 hover:text-orange-500"
                                    }`}
                            >
                                Change Password
                            </button>
                        </nav>
                    </div>

                    {/* Nội dung Form */}
                    {activeTab === "account" && (
                        //handleSubmitAccount}
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">Account</label>
                                <input
                                    type="text"
                                    name="account"
                                    value={formData.account}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Account"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Job Rank</label>
                                <select
                                    name="job_rank"
                                    value={formData.job_rank}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Job Rank</option>
                                    {jobrank.map((job) => (
                                        <option key={job.id} value={job.job_rank}>
                                            {job.job_rank}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Department Code</label>
                                <select
                                    name="department_code"
                                    value={formData.department_code}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept.department_code}>
                                            {dept.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Contract Type</label>
                                <select
                                    name="contract_type"
                                    value={formData.contract_type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Contract</option>
                                    {contracts.map((contract) => (
                                        <option key={contract._id} value={contract.contract_type}>
                                            {contract.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Salary</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Salary"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-700">Start Date</label>
                                <Calendar
                                    fullscreen={false}
                                    onSelect={handleStartDateChange}
                                    value={formData.start_date ? dayjs(formData.start_date) : undefined}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-700">End Date</label>
                                <Calendar
                                    fullscreen={false}
                                    onSelect={(date: Dayjs) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            end_date: date.toDate(), // Chuyển Dayjs thành Date
                                        }))
                                    }
                                    value={formData.end_date ? dayjs(formData.end_date) : undefined} // Chuyển Date thành Dayjs để hiển thị
                                    className="border rounded p-2"
                                />
                            </div>

                            <div className="col-span-2 flex justify-start mt-4">
                                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                                    Update
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "password" && (
                        <form onSubmit={handleSubmitPassword} className="grid grid-cols-2 gap-4 p-4 border rounded-lg shadow-md bg-white">
                            {(["oldPassword", "newPassword", "confirmPassword"] as Array<keyof PasswordData>).map((field) => (
                                <div key={field} className="relative col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1">
                                        {String(field).replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    <input
                                        type={showPassword[field] ? "text" : "password"}
                                        name={field as string} // Ép kiểu về string
                                        value={passwordData[field]}
                                        onChange={handlePasswordChange}
                                        className="w-full p-2 border rounded pr-10"
                                        placeholder={String(field).replace(/([A-Z])/g, " $1").trim()}
                                        required
                                    />
                                    <div
                                        className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                        onClick={() => toggleShowPassword(field)}
                                    >
                                        {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                            ))}

                            <div className="col-span-2 flex justify-start mt-4">
                                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                                    Change Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
