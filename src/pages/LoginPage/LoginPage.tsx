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
// import { Spin } from "antd";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    if (validate()) {
      try {
        await login(email, password);
        const token = localStorage.getItem("token");
        let user;
        if (token) {
          user = await getUserInfobyToken();
          let role = user.data.role_code;
          if (user && user.data) {
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
          } else {
            toast.error("Invalid email or password!");
          }
        }
      } catch (error) {
        toast.error("Please fix the errors before submitting.");
      }
    }
    setIsLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(forgotPasswordEmail);
      toast.success("Password reset link sent to your email!");
      setIsForgotPassword(false);
    } catch (error) {
      toast.error("Error sending password reset link.");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      {isLoading && (
        <div className="!w-screen !h-screen !bg-black !opacity-50 !absolute !top-0 !left-0 !z-9999">
          <LoadingScreen />
        </div>
      )}
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 w-240 h-full object-cover object-center opacity-50 blur-xs"
      />

      {/* Login Form */}
      <div
        className={`w-230 h-140 flex border border-black rounded-[30px] bg-white z-10 ${
          isForgotPassword ? "hidden" : ""
        }`}
      >
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{
            x: isForgotPassword ? "70%" : "0%",
            opacity: isForgotPassword ? 1 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="w-full flex items-center justify-center"
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
            x: isForgotPassword ? "-100%" : "0%",
            opacity: 1,
          }}
          exit={{ x: "100%", opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-1/2 flex flex-col space-y-4 relative z-[-1]"
        >
          <img
            src={Images.Logo}
            alt="Logo"
            className="w-40 mx-auto absolute top-10 right-10"
          />
          <h1 className="text-4xl text-center absolute top-1/3 ">
            Welcome User
          </h1>
          <div className="h-full flex flex-col justify-center absolute right-20 items-start">
            <form onSubmit={handleLoginSubmit} className="gap-4">
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
              <button
                type="submit"
                className="absolute flex justify-center items-center w-40 top-105 right-17 h-8 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="absolute flex justify-center items-center w-40 top-115 right-17 h-8 px-4 py-2 border-amber-500 border rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Forgot Password
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Form */}
      <div
        className={`w-230 h-140 flex items-center border border-black rounded-[30px] bg-white z-20 ${
          !isForgotPassword ? "hidden" : ""
        }`}
      >
        <div className="w-230 h-140 flex border border-black rounded-[30px] bg-white z-10">
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: isForgotPassword ? "0%" : "100%",
              opacity: 1,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-1/2 flex flex-col space-y-4 relative z-[-1]"
          >
            <img
              src={Images.Logo}
              alt="Logo"
              className="w-40 mx-auto absolute top-10 left-10"
            />
            <h1 className="text-4xl  w-full text-center absolute top-39">
              Forgot Password
            </h1>

            <form
              onSubmit={handleForgotPasswordSubmit}
              className="h-full w-3/4 flex flex-col justify-center  left-20 absolute  "
            >
              <div className="relative py-4">
                <span
                  className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${
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

              <button
                type="submit"
                className="absolute flex justify-center items-center w-40 top-98 left-13 h-8 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="absolute flex justify-center items-center w-40 top-108 left-13 h-8 px-4 py-2 bg-white text-black rounded-lg border-amber-500 border cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Back
              </button>
            </form>
          </motion.div>
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: isForgotPassword ? "0%" : "-70%",
              opacity: 1,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex items-center justify-center"
          >
            <img
              src={Images.Background4}
              alt=""
              className="w-120 h-130 scale-x-112 object-contain translate-x-7"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
