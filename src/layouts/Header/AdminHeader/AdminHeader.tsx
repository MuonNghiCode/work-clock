import React from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import Icons from "../../../components/icon";
import { useSidebarStore } from "../../../config/zustand";
import { APP_CONSTANTS } from "../../../constants/appConstants";

const AdminHeader: React.FC = () => {
  const { user } = useUser();
  const { toggleSidebar } = useSidebarStore();
  const location = useLocation();
  const userUrl = localStorage.getItem("imageDataUrl");
  console.log(userUrl);

  const userRole =
    APP_CONSTANTS.roleNames[
      user?.role_code as keyof typeof APP_CONSTANTS.roleNames
    ] || "Guest";
  const currentTitle =
    APP_CONSTANTS.pageTitles[
      location.pathname as keyof typeof APP_CONSTANTS.pageTitles
    ] || "Home";

  return (
    <div className="flex items-center justify-between  w-full py-4 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 bg-transparent"
        >
          <Icons.Menu3 className="w-10 h-10" />
        </button>
        {/* 🟢 Hiển thị title động theo trang */}
        <h1 className="text-white text-3xl font-bold">{currentTitle}</h1>
      </div>
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white text-gray-400 py-2 px-4 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#ff914d]"
          />
          <div className="absolute right-3 top-2">
            <Icons.SearchIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="p-2 bg-white hover:bg-brand-gradient rounded-full group">
          <Icons.Bell className="text-gray-400 group-hover:text-white" />
        </button>
        <div className="flex items-center gap-4 mr-5">
          <div className="bg-white p-2 rounded-full">
            <Icons.User className="text-gray-400" />
          </div>
          <div>
            <p className="font-semibold">{user?.user_name || "Guest"}</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
