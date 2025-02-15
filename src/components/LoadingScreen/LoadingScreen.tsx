import React from "react";
import { motion } from "framer-motion";
import Images from "../images";

const LoadingScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ff914d 10%, #feb78a 50%, #ff914d 90%)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 6s ease infinite",
      }}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onExit}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <motion.div
        className="flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          className="w-full h-full  flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <img src={Images.Logo} alt="logo" className="w-full h-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
