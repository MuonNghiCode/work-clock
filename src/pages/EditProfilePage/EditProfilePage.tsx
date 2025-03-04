import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Sử dụng icon cho password (bạn có thể cài react-icons nếu chưa có: npm install react-icons)
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa"; // Thêm icon camera
// Import ảnh mặc định
import userDefaultImage from "../../assets/images/user-image.png";
//import { UserContext } from "../../context/UserContext"; // Import UserContext
import { changePassword } from "../../services/userService";
interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    district: string;
    city: string;
    postcode: string;
    country: string;
    job_rank: string;
    contract_type: string;
    department_name: string;
    salary: string;
}

interface PasswordData extends Record<string, string> {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const EditProfilePage: React.FC = () => {
    // Khởi tạo state cho active tab: "account" hoặc "password"
    const [activeTab, setActiveTab] = useState<"account" | "password">("account");

    // Lấy dữ liệu từ localStorage (nếu có), hoặc dùng dữ liệu mặc định
    const defaultAccountData: FormData = {
        firstName: "David",
        lastName: "Thompson",
        phoneNumber: "0362740921",
        email: "haitrilehu@gmail.com",
        district: "Thu Duc",
        city: "Ho Chi Minh",
        postcode: "12000",
        country: "Viet Nam",
        job_rank: "DEV1",
        contract_type: "THREE YEAR",
        department_name: "CMS",
        salary: "5000000",
    };

    const [formData, setFormData] = useState<FormData>(() => {
        const storedData = localStorage.getItem("accountData");
        return storedData ? JSON.parse(storedData) : defaultAccountData;
    });

    // State cho dữ liệu đổi mật khẩu
    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // State cho ảnh đại diện


    // State toggle hiển thị mật khẩu (cho từng field)

    const [showPassword, setShowPassword] = useState<Record<keyof PasswordData, boolean>>({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    // Lưu dữ liệu Account Settings vào localStorage khi formData thay đổi (sau khi update)
    useEffect(() => {
        localStorage.setItem("accountData", JSON.stringify(defaultAccountData));
    }, [formData]);

    // Xử lý thay đổi input Account Settings
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi input Password
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



    // Kiểm tra nếu có trường nào rỗng trong đối tượng (trừ các trường không bắt buộc)
    const hasEmptyField = (data: Record<string, string>): boolean =>
        Object.values(data).some(value => value.trim() === "");
    const formDataStrings: Record<string, string> = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        district: formData.district || "",
        city: formData.city || "",
        postcode: formData.postcode || "",
        country: formData.country || "",
    };
    // Submit cho Account Settings
    const handleSubmitAccount = (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra xem có trường nào bị bỏ trống không
        if (hasEmptyField(formDataStrings)) {
            toast.error("Empty field, try again");
            return;
        }

        // Cập nhật dữ liệu vào localStorage (đã có useEffect lo lưu)
        toast.success("Update successfully");
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

                <div className="w-1/4 flex flex-col items-center bg-white p-4 shadow rounded-lg">
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                        <img src={userImage || userDefaultImage} alt="User" className="w-full h-full object-cover" />
                        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <div className="absolute bottom-1 right-1 bg-gray-700 p-1 rounded-full text-white text-xs cursor-pointer hover:bg-gray-600">
                            <FaCamera />
                        </div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold">
                        {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-gray-500">FPT Corp.</p>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-orange-500">Job rank:</p>
                            <p className="text-orange-500 pl-10 pr-1">{formData.job_rank}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-500">Contract:</p>
                            <p className="text-gray-500 pl-10 pr-1">{formData.contract_type}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-500">Department:</p>
                            <p className="text-gray-500 pl-10 pr-1">{formData.department_name}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-green-500">Salary:</p>
                            <p className="text-green-500 pl-10 pr-1">{formData.salary} VND</p>
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
                        <form onSubmit={handleSubmitAccount} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Last Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="district"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Postcode</label>
                                <input
                                    type="text"
                                    name="postcode"
                                    value={formData.postcode}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Postcode"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="Country"
                                />
                            </div>
                            <div className="col-span-2 flex justify-start mt-4">
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                                >
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
