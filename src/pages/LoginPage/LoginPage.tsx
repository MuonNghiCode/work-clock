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
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = checkUser({ email, password });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));

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
  };

  const handleIconClick = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative flex justify-center items-center h-screen ">
      <img
        src={Images.Background2}
        alt="Background"
        className="absolute inset-0 w-220 h-full object-cover object-left opacity-50 blur-xs  left-0 top-0 "
      />

      <div className="w-230 h-140 flex border border-black rounded-[30px] bg-white z-10">
        <div className="w-full flex items-center justify-middle">
          <img
            src={Images.Background3}
            alt=""
            className="w-120 h-130 scale-x-112 object-contain translate-x-5 "
          />
        </div>
        <div className="w-1/2 flex flex-col space-y-4 relative">
          <img
            src={Images.Logo}
            alt="Logo"
            className="w-40  mx-auto absolute top-10 right-10"
          />
          <h1 className="text-4xl w-full text-center absolute right-17 top-39">
            Welcome User
          </h1>
          <div className="h-full flex flex-col justify-center absolute right-20 items-start">
            <form onSubmit={handleSubmit} className="gap-4">
              <div className="relative !py-8">
                <span
                  className={`absolute bg-transparent left-2 top-10 text-gray-500 transition-all pointer-events-none ${
                    email || isEmailFocused
                      ? "text-xs -translate-y-7 bg-white px-2 text-blue-500"
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
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700">
                  <Icons.Email />
                </span>
              </div>
              <div className="relative">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    password || isPasswordFocused
                      ? "text-xs -translate-y-7 bg-white px-2 text-blue-500"
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
                  onClick={handleIconClick}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                >
                  {isPasswordVisible ? <Icons.Unlock /> : <Icons.Lock />}
                </span>
              </div>
              <button
                type="submit"
                className="absolute flex justify-center items-center w-40 top-105 right-17 h-8 px-4 py-2 bg-brand-grandient text-white rounded-lg cursor-pointer transition-all hover:scale-105 focus:outline-none "
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
