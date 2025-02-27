import React from "react";
import Images from "../../images";
import Icons from "../../icon";
import { Link } from "react-router";

const Carousel: React.FC = () => {
  return (
    <div className="relative w-full min-h-[500px] md:h-[800px] px-4 bg-white md:px-8 flex flex-col items-center md:items-start">
      {/* Background Image - Desktop */}
      <picture className="absolute top-0 left-0 hidden w-full h-full overflow-hidden md:block">
        <img
          src={Images.Background6}
          alt="Background"
          className="object-contain w-full h-full"
        />
      </picture>

      {/* Content - Added ml-0 md:ml-8 to shift left on desktop */}
      <div className="relative z-10 flex flex-col items-center md:items-start w-full max-w-4xl px-4 pt-10 pb-10 md:px-10 md:pt-0 md:pb-0 ml-0 md:ml-10">
        <div className="flex items-center justify-center md:justify-start w-full">
          <img src={Images.Logo} alt="logo" className="h-16 w-auto md:h-24" />
          <h1 className="ml-2 text-3xl text-gradient-color md:text-5xl">
            | GR-1
          </h1>
        </div>
        <p className="text-center md:text-left w-full text-sm text-black md:text-xl md:w-[80%] mt-4">
          WorkClock enables employees to effortlessly create and track overtime
          (OT) requests with transparency and efficiency. With an intelligent
          management system, WorkClock helps monitor overtime hours, streamline
          the approval process, and optimize work productivity.
        </p>
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 mt-5 text-white bg-brand-grandient rounded-xl shadow-md md:px-6 md:py-3"
        >
          <span className="text-sm md:text-lg">Explore Now</span>
          <Icons.ArrowRight className="w-5 h-5 md:w-7 md:h-7 border border-white text-white rounded-full p-1" />
        </Link>
      </div>

      {/* Background Image - Mobile (Dưới Explore Now) */}
      <picture className="block w-full mt-6 md:hidden px-4">
        <img
          src={Images.Background5}
          alt="Background"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </picture>
    </div>
  );
};

export default Carousel;
