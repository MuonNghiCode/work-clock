import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import Images from "../../../components/images";
import Icons from "../../../components/icon";

const Sidebar: React.FC<{ isOpen: boolean; closeMenu: () => void }> = ({
  isOpen,
  closeMenu,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-grandient opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 bg-white p-6 flex flex-col gap-6 shadow-lg z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500`}
      >
        <div>
          <Icons.Reject onClick={closeMenu} />
        </div>
        <div className="flex flex-col gap-3 justify-center items-start">
          <a href="#home-section" className="hover:text-gradient-color">
            Home
          </a>
          <a href="#news-section" className="hover:text-gradient-color">
            News
          </a>
          <a href="#about-us-section" className="hover:text-gradient-color">
            About Us
          </a>
          <a href="#contact-us-section" className="hover:text-gradient-color">
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
};

const MainHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex bg-transparent justify-between items-center p-4 md:p-6">
      <div className="flex items-center">
        {!isHomePage && (
          <div className="h-18 flex items-center">
            <img src={Images.Logo} alt="Logo" className="max-w-64 h-25" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-end w-full gap-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between gap-10 rounded-3xl bg-white border border-black px-10 py-0.5 text-lg">
          <a href="#home-section" className="hover:text-gradient-color">
            Home
          </a>
          <a href="#news-section" className="hover:text-gradient-color">
            News
          </a>
          <a href="#about-us-section" className="hover:text-gradient-color">
            About Us
          </a>
          <a href="#contact-us-section" className="hover:text-gradient-color">
            Contact Us
          </a>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-4 text-lg justify-around items-center">
          <Icons.Menu2 className="w-8 h-8" onClick={toggleMenu} />
          {isHomePage && (
            <div className="h-18 flex items-center">
              <img src={Images.Logo} alt="Logo" className="max-w-64 h-25" />
            </div>
          )}
        </div>
        {/* Login Button */}
        <div className="flex text-xl px-4 py-0.5 rounded-3xl bg-brand-grandient text-white hover:scale-110 hover:shadow-brand-orange">
          <NavLink
            to="/login"
            className="flex items-center justify-between gap-3"
          >
            Login
            <Icons.ArrowUpRight className="w-6 h-6 bg-white text-black rounded-3xl p-0.5" />
          </NavLink>
        </div>
      </div>
      <Sidebar isOpen={menuOpen} closeMenu={closeMenu} />
    </div>
  );
};

export default MainHeader;
