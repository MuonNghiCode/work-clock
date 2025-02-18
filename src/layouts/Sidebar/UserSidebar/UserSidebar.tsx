import React from "react";
import { NavLink } from "react-router";
import Icons from "../../../components/icon";
import { logout } from "../../../services/auth";
import { useUser } from "../../../context/UserContext";

const UserSidebar: React.FC = () => {
  const { setUser } = useUser();

  const handleLogut = () => {
    setUser(null);
    logout();
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-4 text-xl">
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-300">Productivity</h2>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Clock />
            TIME TRACKER
          </NavLink>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Calendar />
            CALENDAR
          </NavLink>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-300 ">Analyze</h2>
          <NavLink
            to="/user/dashboard"
            className="flex items-center justify-start gap-3"
          >
            <Icons.Dashboard />
            DASHBOARD
          </NavLink>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.ChartColumn />
            REPORT
          </NavLink>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-300">Preferencies</h2>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Settings />
            SETTING
          </NavLink>
          <NavLink
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogut();
            }}
            className="flex items-center justify-start gap-3 mt-10"
          >
            <Icons.LogOut /> LOG OUT
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
