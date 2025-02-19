import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router";
import Icons from "../../../components/icon";
import { useSidebarStore } from "../../../config/zustand";

const AdminSidebar: React.FC = () => {
  const isSidebarExpanded = useSidebarStore((state) => state.isSidebarOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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
    <>
      <div ref={sidebarRef} className={`flex justify-center text-xl transition-all duration-300 mt-1 ${isSidebarExpanded ? 'w-56' : 'w-24'}`}>
        {/* <div className="flex flex-col gap-5 p-4 text-xl"> */}
        <div className="flex flex-col gap-3 space-y-4 mt-2">
          <div>
            {isSidebarExpanded &&
              <h2 className="text-gray-300">Analyze</h2>}
            <NavLink to="/" className="flex items-center justify-center gap-3">
              <Icons.Dashboard className="w-8 h-8" />
              {isSidebarExpanded && 'DASHBOARD'}
            </NavLink>
          </div>
          <div className="flex flex-col gap-3 space-y-4">
            {isSidebarExpanded &&
              <h2 className="text-gray-300">Management</h2>
            }
            <NavLink
              to="/admin/user"
              className="flex items-center justify-center gap-3"
            >
              <Icons.User className="w-8 h-8" />
              {isSidebarExpanded && 'User Management'}

            </NavLink>
            <NavLink
              to="/admin/project"
              className="flex items-center justify-center gap-3"
            >
              <Icons.FolderDot className="w-8 h-8" />
              {isSidebarExpanded && "Project Management"}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
