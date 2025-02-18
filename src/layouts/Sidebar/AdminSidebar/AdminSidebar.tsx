import React from "react";
import { NavLink } from "react-router";

const AdminSidebar: React.FC = () => {
  return (
    <div className="w-64 h-full p-4">
      <div className="flex flex-col h-full">
        {/* Main Menu */}
        <nav className="flex-1 space-y-1">
          {/* Management Section */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Management
            </p>

            <NavLink
              to="/admin/usermanagement"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive 
                    ? 'bg-[#FFB17A] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="mr-3">👥</span>
              User Management
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;