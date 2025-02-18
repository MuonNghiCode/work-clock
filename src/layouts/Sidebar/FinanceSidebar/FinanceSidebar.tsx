import React from "react";
import { NavLink } from "react-router";
import Icons from "../../../components/icon";

const FinanceSidebar: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-5 p-4 text-xl">
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-300 ">Analyze</h2>
          <NavLink to="" className="flex items-center justify-start gap-3">
            <Icons.Dashboard />
            DASHBOARD
          </NavLink>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-gray-300">Management</h2>
          <NavLink
            to="/finance"
            className="flex items-center justify-start gap-3"
          >
            <Icons.Wallet /> Finance Management
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default FinanceSidebar;
