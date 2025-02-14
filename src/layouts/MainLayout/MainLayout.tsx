import React from "react";
import { Outlet, useLocation } from "react-router";
import MainHeader from "../Header/MainHeader/MainHeader";
import Footer from "../Footer/Footer";
const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="flex flex-col h-screen ">
        {isHomePage ? (
          <header className="fixed top-0 left-0 w-full bg-transparent text-black text-center p-1 z-10">
            <MainHeader />
          </header>
        ) : (
          <header className="fixed top-0 left-0 w-full bg-white  text-black text-center p-4 shadow-orange-header z-10">
            <MainHeader />
          </header>
        )}
        {isHomePage ? (
          <main className="flex-1 bg-white p-4 pt-20">
            <Outlet />
          </main>
        ) : (
          <main className="flex-1 bg-white p-4 pt-30">
            <Outlet />
          </main>
        )}
        {!isHomePage && (
          <footer className="z-10 bg-white text-black text-center p-4 shadow-orange-footer">
            <Footer />
          </footer>
        )}
      </div>
    </>
  );
};

export default MainLayout;
