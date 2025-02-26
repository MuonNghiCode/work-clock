import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../components/images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icons from "../../components/icon";
import { getUserInfobyToken, login } from "../../services/authService";
// import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { Spin } from "antd";

// const userData = [
//   {
//     name: "user",
//     email: "user@example.com",
//     password: "user123",
//     role: "user",
//   },
//   {
//     name: "approval",
//     email: "approval@example.com",
//     password: "approval123",
//     role: "approval",
//   },
//   {
//     name: "finance",
//     email: "finance@example.com",
//     password: "finance123",
//     role: "finance",
//   },
//   {
//     name: "admin",
//     email: "admin@example.com",
//     password: "admin123",
//     role: "admin",
//   },
// ];

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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // const checkUser = (data: { email: string; password: string }) => {
  //   const user = userData.find(
  //     (user) => user.email === data.email && user.password === data.password
  //   );
  //   if (user) {
  //     const token = `${user.role}-${Date.now()}`;
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("role", user.role);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     return user;
  //   } else {
  //     console.log("Invalid email or password");
  //     return null;
  //   }
  // };

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
          // await getAllRoles(user.data.role_code)
          // console.log(localStorage.getItem("user"));
          let role = localStorage.getItem("role");
          console.log(role)
          if (user && user.data) {
            toast.success("Login successful!");
            setTimeout(() => {
              switch (role) {
                case "A001":
                  navigate("/admin");
                  break;
                case "A004":
                  navigate("/user/dashboard");
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
              // window.location.reload();
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

  //       //     await getUserInfobyToken();
  //       // console.log("response in login", response);
  //       const user = checkUser({ email, password });
  //       if (user) {
  //         toast.success("Login successful!");
  //         setTimeout(() => {
  //           switch (user.role) {
  //             case "admin":
  //               navigate("/admin");
  //               break;
  //             case "user":
  //               navigate("/user");
  //               break;
  //             case "approval":
  //               navigate("/approval");
  //               break;
  //             case "finance":
  //               navigate("/finance");
  //               break;
  //             default:
  //               navigate("/");
  //           }
  //           window.location.reload();
  //         }, 1000);
  //       } else {
  //         toast.error("Invalid email or password!");
  //       }
  //     } else {
  //       toast.error("Please fix the errors before submitting.");
  //     }
  //    catch (error) {
  //       toast.error("Please fix the errors before submitting.");
  //     }
  //   }
  // };

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
      {isLoading &&
        <div className="!w-screen !h-screen !bg-black !opacity-50 !absolute !top-0 !left-0 !z-9999">
          <Spin size="large" spinning className="!w-screen !h-screen !flex !top-1/2 !left-1/2 !absolute !z-9999" />
        </div>}
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 w-240 h-full object-cover object-center opacity-50 blur-xs"
      />

      {/* Login Form */}
      <div
        className={`w-230 h-140 flex border border-black rounded-[30px] bg-white z-10 ${isChangePassword ? "hidden" : ""
          }`}
      >
        <div className="w-full flex items-center justify-center">
          <img
            src={Images.Background3}
            alt="Background"
            className="w-120 h-130 scale-x-112 object-contain translate-x-[-30px]"
          />
        </div>
        <div className="w-1/2 flex flex-col space-y-4 relative">
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
                  className={`absolute left-2 top-12 text-gray-500 transition-all pointer-events-none ${email || isEmailFocused
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
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${password || isPasswordFocused
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
                onClick={() => setIsChangePassword(true)}
                className="absolute flex justify-center items-center w-40 top-115 right-17 h-8 px-4 py-2 border-amber-500 border rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Forgot Password
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div
        className={`w-230 h-140 flex items-center border border-black rounded-[30px] bg-white z-20 ${!isChangePassword ? "hidden" : ""
          }`}
      >
        <div className="w-230 h-140 flex border border-black rounded-[30px] bg-white z-10">
          <div className="w-1/2 flex flex-col space-y-4 relative p-10">
            <img
              src={Images.Logo}
              alt="Logo"
              className="w-40 mx-auto absolute top-10 left-10"
            />
            <h1 className="text-4xl w-full text-center absolute top-39">
              Change Password
            </h1>

            <form
              onSubmit={handleChangePasswordSubmit}
              className="h-full w-3/4 flex flex-col justify-center  left-20 absolute  "
            >
              <div className="relative py-4">
                <span
                  className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${email || isEmailFocused
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
                  className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${oldPassword || isoldPasswordFocused
                    ? "text-xs -translate-y-7 bg-none px-2 text-blue-500"
                    : "text-base"
                    }`}
                >
                  Old Password
                </span>
                <input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  onFocus={() => setIsOldChangePassword(true)}
                  onBlur={() => setIsOldChangePassword(false)}
                  className="w-full h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative py-4">
                <span
                  className={`absolute left-2 top-6 text-gray-500 transition-all pointer-events-none ${newPassword || isnewPasswordFocused
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
                className="absolute flex justify-center items-center w-40 top-98 left-13 h-8 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsChangePassword(false)}
                className="absolute flex justify-center items-center w-40 top-108 left-13 h-8 px-4 py-2 bg-white text-black rounded-lg border-amber-500 border cursor-pointer transition-all hover:scale-105 focus:outline-none"
              >
                Back
              </button>
            </form>
          </div>
          <div className="w-full flex items-center justify-center">
            <img
              src={Images.Background4}
              alt=""
              className="w-120 h-130 scale-x-112 object-contain translate-x-7"
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default LoginPage;
