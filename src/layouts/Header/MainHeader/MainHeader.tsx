import React from "react";
import { NavLink, useLocation } from "react-router";
import Images from "../../../components/images";
import Icons from "../../../components/icon";

const MainHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex bg-transparent justify-between items-center p-4 md:p-6">
      {!isHomePage && (
        <div className="h-18 flex items-center">
          <img src={Images.Logo} alt="logo" className="max-w-64 h-25" />
        </div>
      )}
      <div className="relative bg-transparent flex items-center justify-end w-full gap-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between gap-10 rounded-3xl bg-white border border-black px-10 py-0.5 text-lg">
          <NavLink to="/" className="hover:text-gradient-color">
            Home
          </NavLink>
          <NavLink to="/about" className="hover:text-gradient-color">
            About Us
          </NavLink>
          <NavLink to="/contact" className="hover:text-gradient-color">
            Contact
          </NavLink>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-4 text-lg">
          <NavLink to="/" className="hover:text-gradient-color">
            Home
          </NavLink>
          <NavLink to="/about" className="hover:text-gradient-color">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:text-gradient-color">
            Contact
          </NavLink>
        </div>
        {/* Login Button */}
        <div className="flex items-center justify-between gap-3 text-xl px-4 py-0.5 rounded-3xl bg-brand-grandient text-white hover:scale-110 hover:shadow-brand-orange">
          <NavLink to="/login" className="flex-1">
            Login
          </NavLink>
          <Icons.ArrowUpRight className="w-6 h-6 bg-white text-black rounded-3xl p-0.5" />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
