import React, { useEffect, useState, forwardRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "antd";
import { FaCalendarAlt } from "react-icons/fa";
// Sử dụng icon cho password (bạn có thể cài react-icons nếu chưa có: npm install react-icons)
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa"; // Thêm icon camera
// Import ảnh mặc định
import userDefaultImage from "../../assets/images/user-image.png";
//import { UserContext } from "../../context/UserContext"; // Import UserContext
import { changePassword, getEmployeeByUserId, updateEmployee } from "../../services/userService";
import { getAllDepartments } from "../../services/userService";
import { getAllContracts } from "../../services/userService";
import dayjs, { Dayjs } from "dayjs";
interface ProfileImageUploadProps {
    userId: string;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

interface Department {
    _id: string;
    department_code: string;
    description: string;
}

interface Contract {
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
    full_name: string;
    avatar_url: string;
    department_code: string;
    salary: number;
    user_id: string;
    start_date: Date | null;
    end_date: Date | null;
}
interface EditProfilePageProps {
    userData: FormData;
    departments: Department[];
    contracts: Contract[];
    onUpdate: (data: FormData) => void;
}

const EditProfilePage: React.FC = () => {
    const convertFormDataToPayload = (data: FormData) => ({
        ...data,
        start_date: data.start_date ? data.start_date.toISOString().split("T")[0] : undefined, // [UPDATED]
        end_date: data.end_date ? data.end_date.toISOString().split("T")[0] : undefined,       // [UPDATED]
    });

    // [UPDATED] Inline CustomDateInput component với icon lịch
    const CustomDateInput = forwardRef<
        HTMLInputElement,
        { value?: string; onClick?: () => void; placeholder?: string }
    >(({ value, onClick, placeholder }, ref) => (
        <div className="relative">
            <input
                className="w-full p-2 border rounded pr-10 cursor-pointer"
                onClick={onClick}
                ref={ref}
                value={value || ""}
                placeholder={placeholder}
                readOnly
            />
            <FaCalendarAlt
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={onClick}
            />
        </div>
    ));
    const fetchedData = {
        start_date: "2025-03-10",
        end_date: "2025-03-20",
    };

    const [formData, setFormData] = useState<FormData>({
        job_rank: "",
        user_id: "",
        contract_type: "",
        account: "",
        address: "",
        phone: "",
        full_name: "",
        avatar_url: "",
        department_code: "",
        salary: 0,
        start_date: null,
        end_date: null,
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

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
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
                .then((data) => {
                    setFormData({
                        job_rank: data.job_rank,
                        user_id: data.user_id,
                        contract_type: data.contract_type,
                        account: data.account,
                        address: data.address,
                        phone: data.phone,
                        full_name: data.full_name,
                        avatar_url: data.avatar_url || "",
                        department_code: data.department_code,
                        salary: data.salary,
                        start_date: data.start_date ? new Date(data.start_date) : null,
                        end_date: data.end_date ? new Date(data.end_date) : null,
                    });
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
                setDepartments(deptData);
                setContracts(contractData);
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
    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setFormData((prev) => ({ ...prev, end_date: date })); // Lưu luôn đối tượng Date
        }
    };


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };
            // Gọi API cập nhật ngay khi người dùng thay đổi thông tin
            updateEmployeeData(updatedFormData);
            return updatedFormData;
        });
    };
    const updateEmployeeData = async (updatedData: FormData) => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            toast.error("User ID is missing");
            return;
        }
        try {
            // [UPDATED] Chuyển đổi Date sang chuỗi định dạng "YYYY-MM-DD"
            const payload = {
                ...updatedData,
                start_date: updatedData.start_date ? updatedData.start_date.toISOString().split("T")[0] : undefined,
                end_date: updatedData.end_date ? updatedData.end_date.toISOString().split("T")[0] : undefined,
            };
            await updateEmployee(storedUserId, payload);
            localStorage.setItem("accountData", JSON.stringify(payload));
            toast.success("Updated successfully!");
        } catch (error) {
            console.error("Error updating employee:", error);
            toast.error("Error updating employee");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const storedUserId = localStorage.getItem("userId");

        if (!storedUserId) {
            toast.error("User ID is missing");
            return;
        }

        const formattedData = {
            ...formData,
            start_date: formData.start_date ? formData.start_date.toISOString() : undefined,
            end_date: formData.end_date ? formData.end_date.toISOString() : undefined,
        };

        try {
            await updateEmployee(storedUserId, formattedData);
            localStorage.setItem("accountData", JSON.stringify(formattedData));
            toast.success("Employee updated successfully!");
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

    // Xử lý thay đổi ảnh đại diện
    const [userImage, setUserImage] = useState<string | null>(() => {
        return localStorage.getItem("userImage") || null;
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const imageData = reader.result as string;
                setUserImage(imageData); // Hiển thị ngay ảnh mới
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (userImage) {
            localStorage.setItem("userImage", userImage);
        }
    }, [userImage]);
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

                <div className="w-1/4 flex flex-col items-center bg-white p-4 shadow rounded-lg">
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                        <img src={userImage || userDefaultImage} alt="User" className="w-full h-full object-cover" />
                        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <div className="absolute bottom-1 right-1 bg-gray-700 p-1 rounded-full text-white text-xs cursor-pointer hover:bg-gray-600">
                            <FaCamera />
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
                                <input
                                    type="text"
                                    name="job_rank"
                                    value={formData.job_rank}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Job Rank"
                                />
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
