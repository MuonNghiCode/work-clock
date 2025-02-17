import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../components/images";

const ChangePassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUserData = () => {
    const storedData = localStorage.getItem("userData");
    return storedData
      ? JSON.parse(storedData)
      : [
          { email: "user@example.com", password: "user123", role: "user" },
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
          { email: "admin@example.com", password: "admin123", role: "admin" },
        ];
  };

  const [userData, setUserData] = useState(getUserData);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !oldPassword || !newPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const userIndex = userData.findIndex(
      (user: { email: string; password: string }) =>
        user.email === email && user.password === oldPassword
    );

    if (userIndex !== -1) {
      const updatedUsers = [...userData];
      updatedUsers[userIndex].password = newPassword;
      setUserData(updatedUsers);
      localStorage.setItem("userData", JSON.stringify(updatedUsers));

      alert("Đổi mật khẩu thành công!");
      navigate("/");
    } else {
      setError("Email hoặc mật khẩu cũ không đúng!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <img
        src={Images.work2}
        alt="Background"
        className="absolute inset-0 w-3/5 -z-10 h-full object-cover opacity-30 blur-xs"
      />
      <div className="w-[500px] p-8 border border-gray-300 rounded-2xl bg-white shadow-lg">
        <div className="text-center">
          <img src={Images.Logo} alt="Logo" className="w-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Đổi Mật Khẩu</h1>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
          <div className="relative">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600">Mật khẩu cũ</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-600">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-40 h-10 px-4 py-2 bg-gray-200 border border-gray-400 rounded-lg hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="w-40 h-10 px-4 py-2 bg-blue-500 text-white border border-blue-700 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
