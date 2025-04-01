import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../components/images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icons from "../../components/icon";
import { motion } from "framer-motion";
import {
  getUserInfobyToken,
  login,
  forgotPassword,
} from "../../services/authService";
import { useUserStore } from "../../config/zustand";
import { getEmployeeByUserId } from "../../services/userService";
// import { Spin } from "antd";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); // Access the setUser function from Zustand

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const response = await login(email, password);
      if (response.success) {
        const user = await getUserInfobyToken();
        console.log(user.data._id);
        let role = user.data.role_code;
        if (user && user.data) {
          const employee = await getEmployeeByUserId(user.data._id);
          toast.success("Login successful!");
          setTimeout(() => {
            switch (role) {
              case "A001":
                navigate("/admin");
                break;
              case "A004":
                navigate("/user");
                break;
              case "A003":
                navigate("/approval");
                break;
              case "A002":
                navigate("/finance");
                break;
              default:
                navigate("/");
            }
          }, 1000);
          setUser({
            id: user.data._id,
            email: user.data.email,
            role_code: user.data.role_code,
            token: response.data.token,
            username: employee.data.full_name,
            avatarUrl: employee.data.avatar_url,
          });
        }
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotPasswordEmail);
      toast.success("Password reset link sent to your email!");
      setIsForgotPassword(false);
    } catch (error) {
      console.log(error);
      toast.error("Error sending password reset link.");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-200">
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 w-240 h-full object-cover object-center opacity-50 blur-xs"
      />

      {/* Login Form */}
      <div
        className={`lg:w-230 lg:h-140 w-full h-5/6 flex border border-black rounded-[30px] bg-white z-10 ${
          isForgotPassword ? "hidden" : ""
        }`}
      >
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: isForgotPassword ? "55%" : "0%", // Chuyển sang phải khi mở quên mật khẩu
            opacity: 1,
          }}
          exit={{
            x: "-70%", // Di chuyển sang trái trước khi biến mất
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full lg:flex hidden items-center justify-center"
        >
          <img
            src={Images.Background3}
            alt="Background"
            className="w-120 h-130 scale-x-112 z-50 object-contain translate-x-[-30px]"
          />
        </motion.div>

        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: isForgotPassword ? "-170%" : "0%",
            opacity: 1,
          }}
          exit={{ x: "100%", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:w-1/2 w-full h-full relative flex flex-col justify-center items-center space-y-4 lg:space-y-5 lg:z-[-1]"
        >
          <img
            src={Images.Logo}
            alt="Logo"
            className="lg:w-40 w-25 mx-auto absolute  lg:mb-0 top-10 right-5 lg:right-10"
          />

          <div className="h-full lg:mt-20 flex flex-col justify-center absolute lg:right-20 items-start">
            <form onSubmit={handleLoginSubmit} className="gap-4">
              <h1 className="text-3xl lg:text-4xl lg:mt-0 mt-10 text-center whitespace-nowrap ">
                Welcome User
              </h1>
              {/* Email Field */}
              <div className="relative py-10">
                <span
                  className={`absolute left-2 top-12 text-gray-500 transition-all pointer-events-none ${
                    email || isEmailFocused
                      ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                      : "text-base"
                  }`}
                >
                  Email
                </span>
                <input
                  id="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="w-70 h-10 p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm absolute">
                    {errors.email}
                  </p>
                )}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                  <Icons.Email />
                </span>
              </div>

              {/* Password Field */}
              <div className="relative">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    password || isPasswordFocused
                      ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                      : "text-base"
                  }`}
                >
                  Password
                </span>
                <input
                  id="Password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full h-10 p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                >
                  {isPasswordVisible ? <Icons.Unlock /> : <Icons.Lock />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm absolute">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex mt-15 flex-col justify-center items-center space-y-4">
                <button
                  type="submit"
                  className="w-40 h-8 bg-brand-gradient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none flex items-center justify-center"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="w-40 h-8 border-amber-500 border justify-center items-center rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
                >
                  Forgot Password
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Form */}
      <div
        className={`lg:w-230 lg:h-140 w-full h-5/6 flex border border-black rounded-[30px] bg-white z-20 ${
          !isForgotPassword ? "hidden" : ""
        }`}
      >
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: isForgotPassword ? "0%" : "170%",
            opacity: 1,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="lg:w-1/2 w-full h-full relative flex flex-col justify-center items-center space-y-4 lg:space-y-5 lg:z-[-1]"
        >
          <img
            src={Images.Logo}
            alt="Logo"
            className="lg:w-40 w-25 mx-auto absolute top-10 right-5 lg:right-20"
          />

          <form
            onSubmit={handleForgotPasswordSubmit}
            className="relative gap-4 lg:ml-20 mt-10  "
          >
            <h1 className="text-4xl w-full text-center  lg:mb-0 mb-20 lg:top-39">
              Forgot Password
            </h1>
            <div className="lg:mt-10 relative py-4">
              <span
                className={`  absolute  left-2 top-6 text-gray-500 transition-all pointer-events-none ${
                  forgotPasswordEmail || isEmailFocused
                    ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                    : "text-base"
                }`}
              >
                Email
              </span>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                <Icons.Email />
              </span>
            </div>

            <div className="flex mt-15 flex-col items-center space-y-4">
              <button
                type="submit"
                className="w-40 h-8 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Send link
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-40 h-8  border-amber-500 border rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Back
              </button>
            </div>
          </form>
        </motion.div>
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: isForgotPassword ? "0%" : "-55%",
            opacity: 1,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full  items-center justify-center  lg:flex hidden"
        >
          <img
            src={Images.Background4}
            alt=""
            className="w-120 h-130 scale-x-112 object-contain translate-x-7"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
