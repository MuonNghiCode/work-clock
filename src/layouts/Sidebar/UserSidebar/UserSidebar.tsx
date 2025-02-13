import React from "react";
import { NavLink } from "react-router";
import Icons from "../../../components/icon";
const UserSidebar: React.FC = () => {
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
          <NavLink to="" className="flex items-center justify-start gap-3">
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
            <Icons.LogOut /> LOG OUT
          </NavLink>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Settings />
            SETTING
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
