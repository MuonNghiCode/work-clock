import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useSidebarStore } from "../../config/zustand";
import { logout } from "../../services/authService";
import Icons from "../../components/icon";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const role = localStorage.getItem('role');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, closeSidebar } = useSidebarStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      isSidebarOpen
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const handleLogout = () => {
    setShowConfirm(false);
    logout();
  };

  const menuItems: Record<
    string,
    { path: string; icon: JSX.Element; label: string }[]
  > = {
    A001: [
      {
        path: "dashboard",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "Dashboard",
      },
      {
        path: "user",
        icon: <Icons.User className="w-8 h-8" />,
        label: "User Management",
      },
      {
        path: "project",
        icon: <Icons.FolderDot className="w-8 h-8" />,
        label: "Project Management",
      },
    ],
    A003: [
      {
        path: "dashboard",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "Dashboard",
      },
      {
        path: "approval-management",
        icon: <Icons.MdApproval className="w-8 h-8" />,
        label: "Approval Management",
      },
    ],
    A002: [
      {
        path: "dashboard",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "Dashboard",
      },
      {
        path: "paid-management",
        icon: <Icons.Wallet className="w-8 h-8" />,
        label: "Finance Management",
      },
    ],
    A004: [
      {
        path: "dashboard",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "Dashboard",
      },
      {
        path: "calendar",
        icon: <Icons.Calendar className="w-8 h-8" />,
        label: "CALENDAR",
      },
      {
        path: "request",
        icon: <Icons.ChartColumn className="w-8 h-8" />,
        label: "REPORT",
      },
      {
        path: "edit_profile",
        icon: <Icons.Settings className="w-8 h-8" />,
        label: "SETTING",
      },
    ],
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed lg:relative top-0 left-0 h-full transition-transform duration-300 transform -translate-x-full bg-white z-50
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:${isSidebarOpen ? "translate-x-0 w-56" : "w-24"}`}
      >
        <div className="flex flex-col gap-3 space-y-4 mt-2">
          {user?.role && menuItems[user.role] && (
            <>
              <h2 className="flex items-center justify-start gap-3 px-4 py-2 rounded-md transition-all duration-300 text-gray-300">
                Menu
              </h2>
              {menuItems[user.role].map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-start gap-3 mt-5 px-4 py-2 rounded-md transition-all duration-300 transform ${isSidebarOpen
                      ? "justify-start gap-3 px-4"
                      : "justify-center px-2"
                    } py-2 rounded-md transition-all duration-300 overflow-hidden text-ellipsis whitespace-nowrap ${isActive
                      ? isSidebarOpen
                        ? "rounded-l-2xl bg-brand-gradient text-white translate-x-9"
                        : "rounded-l-2xl bg-brand-gradient text-white translate-x-9"
                      : "bg-transparent"
                    } ${hoveredIndex !== null && hoveredIndex !== index
                      ? "text-gray-500 blur-[2px]"
                      : "text-black"
                    } ${isSidebarOpen ? "max-w-[180px]" : "max-w-[50px]"}`
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon xích trái khi sidebar đóng và active */}
                      <span
                        className={`flex-shrink-0 transition-all duration-300 ${isActive && !isSidebarOpen ? "ml-[-5px]" : ""
                          }`}
                      >
                        {item.icon}
                      </span>
                      {isSidebarOpen && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          )}

          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className={`flex items-center justify-start gap-3 mt-5 px-4 py-2 rounded-md transition-all duration-300 transform ${isSidebarOpen
              ? "rounded-l-2xl hover:bg-red-600 hover:text-white hover:translate-x-9"
              : "rounded-l-2xl hover:bg-red-600 hover:text-white hover:translate-x-3"
              }`}
          >
            <Icons.LogOut className="w-8 h-8" />
            {isSidebarOpen && "Log out"}
          </NavLink>
        </div>
      </div>

      {
        showConfirm && (
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
        )
      }
    </>
  );
};

export default Sidebar;
