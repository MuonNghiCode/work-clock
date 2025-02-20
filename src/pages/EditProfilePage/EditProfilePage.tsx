import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Sử dụng icon cho password (bạn có thể cài react-icons nếu chưa có: npm install react-icons)
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa"; // Thêm icon camera
// Import ảnh mặc định
import userDefaultImage from "../../assets/images/user-image.png";
//import { UserContext } from "../../context/UserContext"; // Import UserContext

interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    district: string;
    city: string;
    postcode: string;
    country: string;
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
        firstName: "Nathaniel",
        lastName: "Poole",
        phoneNumber: "+1800-000",
        email: "nathaniel.poole@microsoft.com",
        district: "Thu Duc",
        city: "Ho Chi Minh",
        postcode: "12000",
        country: "Viet Nam",
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
    const [userImage, setUserImage] = useState<string>(() => {
        return localStorage.getItem("userImage") || userDefaultImage;
    });

    // State toggle hiển thị mật khẩu (cho từng field)
    const [showPassword, setShowPassword] = useState<{
        old: boolean;
        new: boolean;
        confirm: boolean;
    }>({
        old: false,
        new: false,
        confirm: false,
    });

    // Lưu dữ liệu Account Settings vào localStorage khi formData thay đổi (sau khi update)
    useEffect(() => {
        localStorage.setItem("accountData", JSON.stringify(formData));
    }, [formData]);
    useEffect(() => {
        localStorage.setItem("userImage", userImage);
    }, [userImage]);
    // Xử lý thay đổi input Account Settings
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi input Password
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi ảnh đại diện
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(URL.createObjectURL(e.target.files[0]));
        }
    };


    // Kiểm tra nếu có trường nào rỗng trong đối tượng (trừ các trường không bắt buộc)
    const hasEmptyField = (data: Record<string, string>): boolean =>
        Object.values(data).some(value => value.trim() === "");
    const formDataStrings: Record<string, string> = {
        firstName: formData.firstName.toString(),
        lastName: formData.lastName.toString(),
        phoneNumber: formData.phoneNumber.toString(),
        email: formData.email.toString(),
        district: formData.district.toString(),
        city: formData.city.toString(),
        postcode: formData.postcode.toString(),
        country: formData.country.toString(),
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
    const handleSubmitPassword = (e: React.FormEvent) => {
        e.preventDefault();

        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Empty field, try again");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Giả lập việc lưu mật khẩu mới vào localStorage
        localStorage.setItem("userPassword", newPassword);

        toast.success("Password updated successfully");

        // Reset lại form mật khẩu
        setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    // Toggle show/hide password cho các field
    const toggleShowPassword = (field: "old" | "new" | "confirm") => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
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
                        <img src={userDefaultImage} alt="User" className="w-full h-full object-cover" />
                        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <div className="absolute bottom-1 right-1 bg-gray-700 p-1 rounded-full text-white text-xs cursor-pointer hover:bg-gray-600">
                            <FaCamera />
                        </div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold">
                        {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-gray-500">FPT Corp.</p>
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
                        <form onSubmit={handleSubmitPassword} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 relative">
                                <label className="block text-gray-700">Old Password</label>
                                <input
                                    type={showPassword.old ? "text" : "password"}
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 border rounded pr-10"
                                    placeholder="Old Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                    onClick={() => toggleShowPassword("old")}
                                >
                                    {showPassword.old ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">New Password</label>
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 border rounded pr-10"
                                    placeholder="New Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                    onClick={() => toggleShowPassword("new")}
                                >
                                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700">Confirm Password</label>
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full p-2 border rounded pr-10"
                                    placeholder="Confirm Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                    onClick={() => toggleShowPassword("confirm")}
                                >
                                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-start mt-4">
                                <button
                                    type="submit"
                                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                                >
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
