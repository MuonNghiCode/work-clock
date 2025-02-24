import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../components/images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icons from "../../components/icon";

const userData = [
  {
    name: "user",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
  {
    name: "approval",
    email: "approval@example.com",
    password: "approval123",
    role: "approval",
  },
  {
    name: "finance",
    email: "finance@example.com",
    password: "finance123",
    role: "finance",
  },
  {
    name: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isnewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isoldPasswordFocused, setIsOldChangePassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();

  const checkUser = (data: { email: string; password: string }) => {
    const user = userData.find(
      (user) => user.email === data.email && user.password === data.password
    );
    if (user) {
      const token = `${user.role}-${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } else {
      console.log("Invalid email or password");
      return null;
    }
  };

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const user = checkUser({ email, password });
      if (user) {
        toast.success("Login successful!");
        setTimeout(() => {
          switch (user.role) {
            case "admin":
              navigate("/admin");
              break;
            case "user":
              navigate("/user");
              break;
            case "approval":
              navigate("/approval");
              break;
            case "finance":
              navigate("/finance");
              break;
            default:
              navigate("/");
          }
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Invalid email or password!");
      }
    } else {
      toast.error("Please fix the errors before submitting.");
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !oldPassword || !newPassword) {
      toast.error("Please fill all the fields.");
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
      toast.success("Password changed successfully!");
      navigate("/login");
    } else {
      toast.error("Incorrect email or old password.");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 lg:w-2/3 w-full h-screen object-cover object-center opacity-50 blur-xs"
      />

      {/* Login Form */}
      <div
        className={`lg:w-2/3 w-screen m-0 lg:m-0 lg:h-4/5  h-4/6 flex border border-black rounded-[30px] bg-white z-10 ${
          isChangePassword ? "hidden" : ""
        }`}
      >
        <div className="w-full  items-center lg:flex hidden">
          <img
            src={Images.Background3}
            alt="Background"
            className="w-full h-12/13 scale-x-112 object-contain translate-x-[-60px]"
          />
        </div>
        <div className="lg:w-1/2 w-1/3 lg:flex flex-col space-y-4 relative">
          <img
            src={Images.Logo}
            alt="Logo"
            className="w-28 lg:w-40 mx-auto absolute top-3 left-10 "
          />

          <h1 className="text-3xl lg:text-4xl text-center left-11 lg:translate-x-[-40px] absolute lg:top-30 top-20 whitespace-nowrap">
            Welcome User
          </h1>
          <div className=" h-full flex flex-col justify-center absolute lg:top-0 top-[-20px] left-11 lg:right-20 lg:items-end">
            <form
              onSubmit={handleLoginSubmit}
              className="h-full relative lg:top-17 lg:left-10 flex flex-col justify-center items-center space-y-6"
            >
              {/* Email Field */}
              <div className="relative w-full lg:w-80">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    email || isEmailFocused
                      ? "text-xs -translate-y-6 px-2 text-blue-500"
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
                  className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="relative w-full lg:w-80">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    password || isPasswordFocused
                      ? "text-xs -translate-y-6 px-2 text-blue-500"
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
                  className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Buttons */}
              <button
                type="submit"
                className="mt-5 lg:mt-2 w-50 h-10 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsChangePassword(true)}
                className="w-50 h-10 px-4 py-2 bg-white text-black border-amber-500 border rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Forgot Password
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div
        className={`lg:w-2/3 w-full lg:h-4/5 h-4/6 flex items-center border border-black rounded-[30px] bg-white z-20 ${
          !isChangePassword ? "hidden" : ""
        }`}
      >
        <div className="w-full h-full flex border border-black rounded-[30px] bg-white z-10 flex-col lg:flex-row">
          {/* Left Section - Form */}
          <div className="lg:w-1/2 w-full flex flex-col space-y-4 relative p-10">
            <img
              src={Images.Logo}
              alt="Logo"
              className="w-28 lg:w-40 mx-auto absolute top-3 left-10  "
            />
            <h1 className="text-3xl lg:text-4xl text-center absolute top-20 whitespace-nowrap">
              Change Password
            </h1>

            <form
              onSubmit={handleChangePasswordSubmit}
              className="h-full flex flex-col justify-center items-center space-y-6  mt-30"
            >
              {/* Email Field */}
              <div className="relative w-full lg:w-80">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    email || isEmailFocused
                      ? "text-xs -translate-y-6 px-2 text-blue-500"
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

              {/* Old Password Field */}
              <div className="relative w-full lg:w-80">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    oldPassword || isoldPasswordFocused
                      ? "text-xs -translate-y-6 px-2 text-blue-500"
                      : "text-base"
                  }`}
                >
                  Old Password
                </span>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  onFocus={() => setIsOldChangePassword(true)}
                  onBlur={() => setIsOldChangePassword(false)}
                  className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* New Password Field */}
              <div className="relative w-full lg:w-80">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    newPassword || isnewPasswordFocused
                      ? "text-xs -translate-y-6 px-2 text-blue-500"
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

              {/* Buttons */}

              <button
                type="submit"
                className="mt-5 lg:mt-2 w-50 h-10 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsChangePassword(false)}
                className="w-50 h-10 px-4 py-2 bg-white text-black border-amber-500 border rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Back
              </button>
            </form>
          </div>

          {/* Right Section - Image */}
          <div className="w-full  items-center lg:flex hidden">
            <img
              src={Images.Background4}
              className="w-full h-12/13 scale-x-112 object-contain translate-x-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
