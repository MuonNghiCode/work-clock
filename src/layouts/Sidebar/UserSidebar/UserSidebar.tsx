import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import Icons from "../../../components/icon";
import { logout } from "../../../services/auth";
import { useUser } from "../../../context/UserContext";
import { useSidebarStore } from "../../../config/zustand";

const UserSidebar: React.FC = () => {
  const { setUser } = useUser();
  const isSidebarExpanded: boolean = useSidebarStore(
    (state: { isSidebarOpen: boolean }) => state.isSidebarOpen
  );
  const handleLogut = () => {
    setUser(null);
    logout();
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
      <div
        ref={sidebarRef}
        className={`flex justify-center text-xl transition-all duration-300 mt-1 ${
          isSidebarExpanded ? "w-56" : "w-24"
        }`}
      >
      <div className="flex flex-col gap-3 space-y-4 mt-2">
        <div className="flex flex-col gap-3 space-y-4">
            {isSidebarExpanded && (
            <h2 className="text-gray-300">Productivity</h2>
            )}
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Clock className="w-8 h-8" />
            {isSidebarExpanded && "TIME TRACKER"}
          </NavLink>
          <NavLink to="/user/calendar" className="flex items-center justify-start gap-3">
            <Icons.Calendar className="w-8 h-8" />
            {isSidebarExpanded && "CALENDAR"}
          </NavLink>
        </div>
        <div className="flex flex-col gap-3 space-y-4">
          {isSidebarExpanded && <h2 className="text-gray-300 ">Analyze</h2>}
          <NavLink
            to="/user/dashboard"
            className="flex items-center justify-start gap-3"
          >
            <Icons.Dashboard className="w-8 h-8" />
            {isSidebarExpanded && "DASHBOARD"}
          </NavLink>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.ChartColumn className="w-8 h-8" />
            {isSidebarExpanded && "REPORT"}
          </NavLink>
        </div>
        <div className="flex flex-col gap-3 space-y-4">
            {isSidebarExpanded && (
            <h2 className="text-gray-300">Preferencies</h2>
            )}
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Settings className="w-8 h-8" />
            {isSidebarExpanded && "SETTING"}
          </NavLink>
          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogut();
            }}
            className="flex items-center justify-start gap-3 mt-10"
          >
            <Icons.LogOut className="w-8 h-8" />
              {isSidebarExpanded && "LOG OUT"}
          </NavLink>
          </div>
      </div>
    </div>
  );
};

export default UserSidebar;
