import React, { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const LazyCarousel = lazy(
  () => import("../../components/HomeComponents/Carousel/Carousel")
);
const LazyNews = lazy(
  () => import("../../components/HomeComponents/News/News")
);

const HomePage: React.FC = () => {
  const { ref: carouselRef, inView: isCarouselInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const { ref: newsRef, inView: isNewsInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  return (
    <>
      <div ref={carouselRef} style={{ minHeight: "300px" }}>
        <Suspense fallback={<div>Loading Carousel...</div>}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              isCarouselInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.5 }}
            style={{
              overflow: "hidden",
              visibility: isCarouselInView ? "visible" : "hidden",
            }}
          >
            <LazyCarousel />
          </motion.div>
        </Suspense>
      </div>

      <div ref={newsRef} style={{ minHeight: "300px" }}>
        <Suspense fallback={<div>Loading News...</div>}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              isNewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.5 }}
            style={{
              overflow: "hidden",
              visibility: isNewsInView ? "visible" : "hidden",
            }}
          >
            <LazyNews />
          </motion.div>
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
