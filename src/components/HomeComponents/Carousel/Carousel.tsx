import React from "react";
import Images from "../../images";
import Icons from "../../icon";
import { Link } from "react-router";

const Carousel: React.FC = () => {
  return (
    <>
      <div className="relative w-full min-h-screen bg-white px-4 md:px-8">
        <img
          src={Images.Background}
          alt="Background"
          className="w-full h-auto"
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start px-4 md:px-10">
          <div className="flex items-center">
            <img
              src={Images.Logo}
              alt="logo"
              className="max-w-40 md:max-w-70 h-20 md:h-40"
            />
            <h1 className="text-gradient-color text-3xl md:text-5xl ml-2">
              | GR-1
            </h1>
          </div>
          <p className="text-black text-sm md:text-base px-2 md:px-5 w-full md:w-150">
            WorkClock enables employees to effortlessly create and track
            overtime (OT) requests with transparency and efficiency. With an
            intelligent management system, WorkClock helps monitor overtime
            hours, streamline the approval process, and optimize work
            productivity.
          </p>
          <Link
            to="/login"
            className="flex items-center gap-2 md:gap-4 bg-brand-grandient text-white px-2 md:px-4 py-1 md:py-2 rounded-xl mt-5 ml-2 md:ml-4"
          >
            <span className="text-sm md:text-lg">Explore Now</span>
            <Icons.ArrowRight className="w-5 md:w-7 h-5 md:h-7 border border-white text-white rounded-3xl p-0.5 md:p-1" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Carousel;
