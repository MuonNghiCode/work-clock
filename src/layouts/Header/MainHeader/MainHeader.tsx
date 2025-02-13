import React from "react";
import { NavLink, useLocation } from "react-router";
import { ArrowRight } from "lucide-react";
import logo from "../../../assets/images/logo.png";

const MainHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex bg-transparent justify-between items-center">
      {!isHomePage && (
        <div className="h-18 flex items-center py-4 px-6">
          <img src={logo} alt="logo" className="max-w-64 h-25" />
        </div>
      )}
      <div className="relative bg-transparent flex items-center justify-end w-full px-6 py-4 gap-4 mr-4">
        <div className="flex gap-4 rounded-3xl border border-black px-4 py-0.5 text-lg">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/news">News</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
        <div className="flex items-center justify-between gap-3 text-xl px-4 py-0.5 rounded-3xl bg-brand-grandient text-white">
          <NavLink to="/login" className="flex-1">
            Login Now
          </NavLink>
          <ArrowRight className="w-6 h-6 bg-white text-black rounded-3xl p-0.5" />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
