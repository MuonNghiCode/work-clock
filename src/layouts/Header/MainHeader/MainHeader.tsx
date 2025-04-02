import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import Images from "../../../components/images";
import Icons from "../../../components/icon";

const navItems = [
  { href: "#home-section", label: "Home" },
  { href: "#news-section", label: "News" },
  { href: "#about-us-section", label: "About Us" },
  { href: "#contact-us-section", label: "Contact Us" },
];

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
        className={`fixed top-0 left-0 h-full w-3/4 bg-white p-6 flex flex-col gap-6 shadow-lg z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-500`}
      >
        <div>
          <Icons.Reject onClick={closeMenu} />
        </div>
        <div className="flex flex-col gap-3 justify-center items-start">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-gradient-color"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

const MainHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Lấy thông tin của các section
      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: (section as HTMLElement).offsetTop - 200,
              height: (section as HTMLElement).offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;

      // Xử lý đặc biệt cho home section khi ở đầu trang
      if (currentPosition < 200) {
        // Nếu gần đầu trang
        setActiveSection("home-section");
        return;
      }

      // Tìm section active dựa trên vị trí cuộn
      const active = sections.find(
        (section) =>
          section &&
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );

      if (active) {
        setActiveSection(active.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center p-4 md:p-6 transition-all duration-300 ${scrolled ? "bg-transparent" : "bg-transparent"
        }`}
    >
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
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`hover:text-gradient-color ${activeSection === item.href.substring(1)
                  ? "text-gradient-color underline"
                  : ""
                }`}
            >
              {item.label}
            </a>
          ))}
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
