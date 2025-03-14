import React, { memo, useCallback, useEffect, useState } from "react";
import Images from "../../images";
import Icons from "../../icon";
import { Link } from "react-router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Sparkles } from "lucide-react";
import Magnet from "../../Magnet/Magnet";

const StatusBadge = memo(() => (
  <div
    className="inline-block animate-float lg:mx-0"
    data-aos="zoom-in"
    data-aos-delay="400"
  >
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-brand-gradient rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 py-2 border rounded-full sm:px-4 backdrop-blur-xl border-white/10">
        <span className="bg-brand-gradient text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-[#ff914d]" />
          Ready To Explore
        </span>
      </div>
    </div>
  </div>
));

const TYPING_SPEED = 50;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 1000;
const WORDS = [
  "Welcome to Workclock – The Smart Way to Manage Your Overtime",
  "Time is Money – Work Smarter, Earn Better",
];

const Carousel: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Lottie configuration
  const lottieOptions = {
    src: "https://lottie.host/56dcf58a-134b-4677-81dd-3f52a60878a9/Banf4GFCWC.lottie", // Thay bằng URL của animation mới
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: true,
    },
    style: { width: "100%", height: "100%" },
    className: `w-full h-full transition-all duration-500 ${
      isHovering
        ? "scale-[180%] sm:scale-[160%] md:scale-[150%] lg:scale-[145%] rotate-2"
        : "scale-[175%] sm:scale-[155%] md:scale-[145%] lg:scale-[140%]"
    }`,
  };

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="w-full px-4 mb-7 md:min-h-screen md:px-8 md:flex md:items-center md:justify-between">
      {/* Content - Added ml-0 md:ml-8 to shift left on desktop */}
      <div className="flex flex-col items-center w-full max-w-4xl px-4 pt-10 pb-10 ml-0 md:items-start md:px-10 md:pt-0 md:pb-0 md:ml-10">
        <StatusBadge />
        <div className="flex items-center justify-center w-full md:justify-start">
          <img src={Images.Logo} alt="logo" className="w-auto h-16 md:h-40" />
          <h1 className="ml-2 text-3xl text-gradient-color md:text-5xl">
            | GR-1
          </h1>
        </div>
        <div className="h-8 flex justify-center lg:justify-start items-center">
          <span className="text-lg sm:text-xl md:text-2xl text-gradient-color animate-pulse">
            {text}
          </span>
          <span className="w-[3px] h-6 bg-gradient-to-t from-[#ff914d] to-white ml-1 animate-blink"></span>
        </div>
        <p className="text-center md:text-left w-full text-sm text-black md:text-xl md:w-[80%] mt-4">
          WorkClock enables employees to effortlessly create and track overtime
          (OT) requests with transparency and efficiency. With an intelligent
          management system, WorkClock helps monitor overtime hours, streamline
          the approval process, and optimize work productivity.
        </p>
        <Magnet padding={100} disabled={false} magnetStrength={2}>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 mt-5 text-white shadow-md bg-brand-grandient rounded-xl md:px-6 md:py-3 border border-transparent glow-effect"
          >
            <span className="text-sm md:text-lg">Explore Now</span>
            <Icons.ArrowRight className="w-5 h-5 p-1 text-white border border-white rounded-full md:w-7 md:h-7" />
          </Link>
        </Magnet>
      </div>

      {/*  Lottie Animation */}
      <div
        className="flex items-center justify-center order-1 w-full mt-10 lg:w-1/2 lg:order-2 sm:mt-16 md:mt-0"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="w-[250px] sm:w-[300px] md:w-[400px] lg:w-[600px] xl:w-[700px]">
          <DotLottieReact {...lottieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
