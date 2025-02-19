import React from "react";
import Images from "../../images";
import Icons from "../../icon";
import { Link } from "react-router";

const Carousel: React.FC = () => {
  return (
    <>
      <div className="relative w-full min-h-screen px-4 bg-white md:px-8">
        <img
          src={Images.Background}
          alt="Background"
          className="w-full h-auto"
        />
        <div className="absolute top-0 left-0 flex flex-col items-start justify-start w-full h-full px-4 md:px-10">
          <div className="flex items-center">
            <img
              src={Images.Logo}
              alt="logo"
              className="h-20 max-w-40 md:max-w-70 md:h-40"
            />
            <h1 className="ml-2 text-3xl text-gradient-color md:text-5xl">
              | GR-1
            </h1>
          </div>
          <p className="w-full px-2 text-sm text-black md:text-base md:px-5 md:w-150">
            WorkClock enables employees to effortlessly create and track
            overtime (OT) requests with transparency and efficiency. With an
            intelligent management system, WorkClock helps monitor overtime
            hours, streamline the approval process, and optimize work
            productivity.
          </p>
          <Link
            to="/login"
            className="flex items-center gap-2 px-2 py-1 mt-5 ml-2 text-white md:gap-4 bg-brand-grandient md:px-4 md:py-2 rounded-xl md:ml-4"
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
