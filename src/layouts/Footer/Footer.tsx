import React from "react";
import Images from "../../components/images";
import { NavLink } from "react-router";

const Footer: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full h-16 p-4">
      <div className="flex items-center gap-2">
        <img src={Images.Logo2} alt="logo" className="max-w-120 h-30" />
      </div>
      <div className="flex w-full justify-evenly items-center gap-8">
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact Us</NavLink>
          </li>
        </ul>
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact Us</NavLink>
          </li>
        </ul>
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact Us</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
