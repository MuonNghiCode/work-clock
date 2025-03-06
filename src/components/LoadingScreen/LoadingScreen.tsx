import React from "react";
import { useLoadingStore } from "../../config/zustand";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";

const getLottieOptions = (src: string) => ({
  src,
  loop: true,
  autoplay: true,
  style: { width: "50px", height: "50px" },
  className: "w-full h-full",
});

const LoadingScreen: React.FC = () => {
  const { isLoading } = useLoadingStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center h-screen overflow-hidden backdrop-blur-lg bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative flex flex-col items-center justify-center p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DotLottieReact
              {...getLottieOptions(
                "https://lottie.host/56dcf58a-134b-4677-81dd-3f52a60878a9/Banf4GFCWC.lottie"
              )}
            />
            <motion.p
              className="mt-4 text-white text-lg font-semibold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Loading, please wait...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
