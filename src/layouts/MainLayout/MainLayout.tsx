import React from "react";
import { Outlet, useLocation } from "react-router";
import { useInView } from "react-intersection-observer";
import MainHeader from "../Header/MainHeader/MainHeader";
import ClickSpark from "../../components/ClickSpark/ClickSpark";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { ref: homeSectionRef, inView: isHomeSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  return (
    <>
      <div className="flex flex-col h-screen">
        <header
          className={`fixed top-0 left-0 w-full text-black text-center z-10 ${
            isHomePage && isHomeSectionInView ? "bg-transparent" : "bg-white/70"
          }`}
        >
          <MainHeader />
        </header>
        <main
          className={`flex-1 p-4 pt-20 md:pt-24 lg:pt-28 ${
            isHomePage ? "bg-white" : "bg-brand-orange-light"
          }`}
        >
          {isHomePage && <div ref={homeSectionRef} id="home-section" />}
          <ClickSpark
            sparkColor="#ff914d"
            sparkSize={15}
            sparkRadius={30}
            sparkCount={8}
            duration={400}
          >
            <Outlet />
          </ClickSpark>
        </main>
        {/* <footer className="z-10 bg-white text-black text-center p-4 ">
          <Footer />
        </footer> */}
      </div>
    </>
  );
};

export default MainLayout;
