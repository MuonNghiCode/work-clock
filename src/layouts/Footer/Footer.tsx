import React from "react";
import Images from "../../components/images";
import Icons from "../../components/icon";

const Footer: React.FC = () => {
  const navItems = [
    { href: "#home-section", label: "Home" },
    { href: "#news-section", label: "News" },
    { href: "#about-us-section", label: "About Us" },
    { href: "#contact-us-section", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-4">
        {/* Logo */}
        <div className="flex items-center justify-center h-full p-4 bg-gray-100 shadow-md rounded-4xl">
          <img src={Images.Logo2} alt="Logo" className="h-auto md:max-w-30" />
        </div>

        {/* Giới thiệu */}
        <div className="flex items-center justify-center h-full p-6 bg-gray-100 shadow-md rounded-4xl md:col-span-3">
          <p className="text-sm leading-6 text-center md:text-lg md:text-left">
            WorkClock – Smart & Transparent Overtime Management WorkClock helps
            employees track OT hours effortlessly, streamline approvals, and
            enhance productivity with an intelligent system.
          </p>
        </div>

        {/* Nội dung thêm */}
        <div className="flex items-center justify-center h-full p-6 bg-gray-100 shadow-md rounded-4xl md:col-span-3">
          <p className="text-sm leading-6 text-center md:text-lg md:text-left">
            WorkClock – Optimize Overtime Tracking Simplify OT requests, ensure
            transparency, and improve efficiency for both employees and
            managers.
          </p>
        </div>

        {/* Ô số 5 */}
        <div className="flex items-center justify-evenly h-full p-6 bg-gray-100 shadow-md rounded-4xl ">
          <Icons.Facebook className="w-6 h-6 text-neutral-900" />
          <Icons.Instagram className="w-6 h-6 text-neutral-900" />
          <Icons.Mail className="w-6 h-6 text-neutral-900" />
        </div>

        {/* Menu điều hướng */}
        <div className="p-6 bg-gray-100 shadow-md rounded-4xl md:col-span-4">
          <div className="flex items-start justify-around gap-3 text-sm md:text-xl">
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
      </div>
    </>
  );
};

export default Footer;
