import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import Icons from "../../../components/icon";
import { useSidebarStore } from "../../../config/zustand";
import { APP_CONSTANTS } from "../../../constants/appConstants";
import { toast } from "react-toastify";
import { logout } from "../../../utils/userUtils";
import { motion } from "framer-motion";
const AdminHeader: React.FC = () => {
  const { user } = useUser();
  const { toggleSidebar } = useSidebarStore();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userRole =
    APP_CONSTANTS.roleNames[
      user?.role_code as keyof typeof APP_CONSTANTS.roleNames
    ] || "Guest";
  const currentTitle =
    APP_CONSTANTS.pageTitles[
      location.pathname as keyof typeof APP_CONSTANTS.pageTitles
    ] || "Home";

  const handleLogout = () => {
    setShowConfirm(false);
    setTimeout(() => {
      toast.success("Logout successfully!");
    }, 1000);
    logout();
  };

  // 🟢 Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between w-full py-4 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 bg-transparent"
          >
            <Icons.Menu3 className="w-10 h-10" />
          </button>
          <h1 className="text-white text-3xl font-bold">{currentTitle}</h1>
        </div>

        {/* 🔔 Notification + User Dropdown */}
        <div className="flex items-center gap-4 bg-white rounded-full p-2">
          <button className="p-2 bg-gray-200 hover:bg-brand-gradient rounded-full group">
            <Icons.Bell className="text-black group-hover:text-white" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-gray-200 p-2 hover:bg-brand-gradient rounded-full group"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Icons.User className="text-black group-hover:text-white" />
            </button>

            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50">
                  <div className="w-10 h-10 flex-shrink-0 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {user?.user_name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                    <p className="text-sm text-gray-600">
                      {user?.email || "NaN"}
                    </p>
                  </div>
                </div>

                {/* Dropdown Actions */}
                <div className="py-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <Icons.LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-brand-orange-light backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 hover:scale-120 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-brand-gradient text-white hover:scale-120 transition cursor-pointer"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
