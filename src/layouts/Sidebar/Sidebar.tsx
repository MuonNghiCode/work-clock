import React, { useEffect, useRef } from "react";
import { useSidebarStore } from "../../config/zustand";
import { logout } from "../../services/auth";
import Icons from "../../components/icon";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const role = localStorage.getItem('role');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

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
    logout();
  };

  const menuItems: Record<
    string,
    { path: string; icon: JSX.Element; label: string }[]
  > = {
    A001: [
      {
        path: "/admin",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "DASHBOARD",
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
        path: "/approval",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "DASHBOARD",
      },
      {
        path: "approval-management",
        icon: <Icons.MdApproval className="w-8 h-8" />,
        label: "Approval Management",
      },
    ],
    A002: [
      {
        path: "/finance",
        icon: <Icons.Dashboard className="w-8 h-8" />,
        label: "DASHBOARD",
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
        label: "DASHBOARD",
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
    <div
      ref={sidebarRef}
      className={`fixed lg:relative top-0 left-0 h-full transition-transform duration-300 transform -translate-x-full bg-white z-50
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:${isSidebarOpen ? "translate-x-0 w-56" : "w-24"}`}
    >
      <div className="flex flex-col gap-3 space-y-4 mt-2 p-4">
        {role && menuItems[role] && (
          <>
            <h2 className="text-gray-300">Menu</h2>
            {menuItems[role].map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className="flex items-center justify-start gap-3"
              >
                {item.icon} {isSidebarOpen && item.label}
              </NavLink>
            ))}
          </>
        )}

        <NavLink
          to="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="flex items-center justify-start gap-3 mt-10"
        >
          <Icons.LogOut className="w-8 h-8" />
          {isSidebarOpen && "Log out"}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
