import React from "react";
import Images from "../../images";
import Icons from "../../icon";
import { Link } from "react-router";

const Carousel: React.FC = () => {
  return (
    <>
      <div className="relative w-full min-h-screen bg-white px-8 ">
        <div className="absolute top-0 left-0 w-300 h-full">
          <img
            src={Images.Background}
            alt="Background"
            className="w-300 h-auto"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start px-10">
          <div className=" flex items-center">
            <img src={Images.Logo} alt="logo" className="max-w-70 h-40" />
            <h1 className="text-gradient-color text-5xl ml-2">| GR-1</h1>
          </div>
          <p className="text-black text-base px-5 w-150">
            WorkClock enables employees to effortlessly create and track
            overtime (OT) requests with transparency and efficiency. With an
            intelligent management system, WorkClock helps monitor overtime
            hours, streamline the approval process, and optimize work
            productivity.
          </p>
          <Link
            to="/login"
            className="flex items-center gap-4 bg-brand-grandient text-white px-4 py-2 rounded-3xl mt-5 ml-4"
          >
            <span className="text-lg">Get Started</span>
            <Icons.ArrowRight className="w-7 h-7 border border-white text-white rounded-3xl p-1" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Carousel;
