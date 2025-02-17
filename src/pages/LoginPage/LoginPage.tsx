import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import work2 from "../../assets/work2.png";
import logo from "../../assets/images/logo.png";

const userData = [
  {
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
  {
    email: "approval@example.com",
    password: "approval123",
    role: "approval",
  },
  {
    email: "finance@example.com",
    password: "finance123",
    role: "finance",
  },
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkUser = (data: { email: string; password: string }) => {
    const user = userData.find(
      (user) => user.email === data.email && user.password === data.password
    );
    if (user) {
      localStorage.setItem("role", user.role);
      return user.role;
    } else {
      console.log("Invalid email or password");
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = checkUser({ email, password });
    console.log("Role xác định:", role); // Debug
    if (role) {
      switch (role) {
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
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <img
        src={work2}
        alt="Background"
        className="absolute inset-0 w-3/5 -z-10 h-full object-cover opacity-30 blur-xs bg-black"
      />
      <div className="w-230 h-140 flex border border-black rounded-[30px] bg-white">
        <div className="w-full flex items-center justify-middle">
          <img
            src={work2}
            alt=""
            className="w-120 h-130 scale-x-110 object-contain translate-x-6 "
          />
        </div>
        <div className="w-1/2 flex flex-col space-y-4 relative">
          <img
            src={logo}
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
                  className={`absolute left-2 top-10 text-gray-500 transition-all pointer-events-none ${
                    email
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
                  className="w-70 h-10 p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <span
                  className={`absolute left-2 top-2 text-gray-500 transition-all pointer-events-none ${
                    password
                      ? "text-xs -translate-y-7 bg-white px-2 text-blue-500"
                      : "text-base"
                  }`}
                >
                  Password
                </span>
                <input
                  id="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => navigate("/change-password")}
                className="absolute w-30 top-93 right-40 h-5 text-center bg-gray-100 border border-black hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Forgot Password
              </button>
              <button
                type="submit"
                className="absolute w-40 top-105 right-17 h-8 px-4 py-2 bg-gray-100 border border-black rounded-lg hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
