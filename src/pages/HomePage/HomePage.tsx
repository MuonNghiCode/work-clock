import React, { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SplashCursor from "../../components/SplashCursor/SplashCursor";
import Footer from "../../layouts/Footer/Footer";

const LazyCarousel = lazy(
  () => import("../../components/HomeComponents/Carousel/Carousel")
);
const LazyNews = lazy(
  () => import("../../components/HomeComponents/News/News")
);
const LazyAboutUs = lazy(
  () => import("../../components/HomeComponents/ProfilePage/ProfilePage")
);
const LazyContactUs = lazy(
  () => import("../../components/HomeComponents/ContactPage/Contact")
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

  const { ref: aboutUsRef, inView: isAboutUsInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const { ref: contactUsRef, inView: isContactUsInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  return (
    <>
      <div ref={carouselRef} id="home-section" style={{ minHeight: "300px" }}>
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

      <div ref={newsRef} id="news-section" style={{ minHeight: "300px" }}>
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

      <div
        ref={aboutUsRef}
        id="about-us-section"
        style={{ minHeight: "300px" }}
      >
        <Suspense fallback={<div>Loading About Us...</div>}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              isAboutUsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.5 }}
            style={{
              overflow: "hidden",
              visibility: isAboutUsInView ? "visible" : "hidden",
            }}
          >
            <LazyAboutUs />
          </motion.div>
        </Suspense>
      </div>

      <div
        ref={contactUsRef}
        id="contact-us-section"
        style={{ minHeight: "300px" }}
      >
        <Suspense fallback={<div>Loading Contact Us...</div>}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={
              isContactUsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.5 }}
            style={{
              overflow: "hidden",
              visibility: isContactUsInView ? "visible" : "hidden",
            }}
          >
            <LazyContactUs />
          </motion.div>
        </Suspense>
      </div>
      <SplashCursor />
      <Footer />
    </>
  );
};

export default HomePage;
