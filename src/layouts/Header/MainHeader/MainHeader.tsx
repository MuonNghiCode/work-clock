import React from "react";
import { NavLink } from "react-router";

const MainHeader: React.FC = () => {
  return (
    <div className="flex bg-gray-200">
      <div className="relative flex justify-end w-full p-4 gap-4">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/news">News</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </div>
  );
};

export default MainHeader;
