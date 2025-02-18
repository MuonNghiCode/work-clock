import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../components/images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isOldPasswordFocused, setIsOldPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const storedData = localStorage.getItem("userData");
    const userData = storedData ? JSON.parse(storedData) : [];

    const userIndex = userData.findIndex(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === oldPassword
    );

    if (userIndex !== -1) {
      userData[userIndex].password = newPassword;
      localStorage.setItem("userData", JSON.stringify(userData));
      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    } else {
      toast.error("Email hoặc mật khẩu cũ không đúng!");
    }
  };

  const handleIconClick = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 w-220 h-full object-cover object-right opacity-50 blur-xs right-0 top-0"
      />
      <div className="w-230 h-140 flex border border-black rounded-[30px] bg-white z-10">
        <div className="w-1/2 flex flex-col space-y-4 relative p-10">
          <img
            src={Images.Logo}
            alt="Logo"
            className="w-40 mx-auto absolute top-10 left-10"
          />
          <h1 className="text-4xl w-full text-center absolute left-17 top-39">
            Change Password
          </h1>

          <form
            onSubmit={handleChangePassword}
            className="h-full flex flex-col justify-center absolute right-20 items-start"
          >
            <div className="relative py-4">
              <span
                className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${
                  email || isEmailFocused
                    ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                    : "text-base"
                }`}
              >
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative py-4">
              <span
                className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${
                  oldPassword || isOldPasswordFocused
                    ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                    : "text-base"
                }`}
              >
                Old Password
              </span>
              <input
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onFocus={() => setIsOldPasswordFocused(true)}
                onBlur={() => setIsOldPasswordFocused(false)}
                className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={handleIconClick}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
              ></span>
            </div>
            <div className="relative py-4">
              <span
                className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${
                  newPassword || isNewPasswordFocused
                    ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                    : "text-base"
                }`}
              >
                New Password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setIsNewPasswordFocused(true)}
                onBlur={() => setIsNewPasswordFocused(false)}
                className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="absolute flex justify-center items-center w-40 top-105 left-17 h-8 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="absolute flex justify-center items-center w-40 top-115 left-17 h-8 px-4 py-2 bg-gray-600 text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
            >
              Back
            </button>
          </form>
        </div>
        <div className="w-full flex items-center justify-center">
          <img
            src={Images.Background4}
            alt=""
            className="w-120 h-130 scale-x-112 object-contain translate-x-5"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
