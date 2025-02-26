import React, { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "../../config/zustand";
import { logout } from "../../services/authService";
import Icons from "../../components/icon";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const role = localStorage.getItem("role");
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
        className={`fixed lg:relative top-0 left-0 h-full transition-all duration-300 bg-white shadow-lg z-50
        ${
          isSidebarOpen ? "translate-x-0 w-60" : "-translate-x-full lg:w-20"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col gap-4 p-4 mt-4">
          {role && menuItems[role] && (
            <>
              <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider px-2">
                Menu
              </h2>
              {menuItems[role].map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? "bg-brand-gradient text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    ${
                      hoveredIndex !== null && hoveredIndex !== index
                        ? "opacity-50"
                        : "opacity-100"
                    }`
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="flex-shrink-0 text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="truncate font-medium">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </>
          )}
          <div className="border-t border-gray-200 my-2"></div>
          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="flex items-center gap-4 px-3 py-2 rounded-lg text-red-600 transition-all duration-300 hover:bg-red-100"
          >
            <Icons.LogOut className="w-6 h-6" />
            {isSidebarOpen && <span className="font-medium">Log out</span>}
          </NavLink>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
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

export default Sidebar;
