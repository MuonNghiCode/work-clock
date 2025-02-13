import React from "react";
import { Outlet, useLocation } from "react-router";
import MainHeader from "../Header/MainHeader/MainHeader";
import Footer from "../Footer/Footer";
const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="flex flex-col h-screen">
        {isHomePage ? (
          <header className="relative bg-white text-black text-center p-1 ">
            <MainHeader />
          </header>
        ) : (
          <header className="relative bg-white text-black text-center p-4 shadow-orange-header">
            <MainHeader />
          </header>
        )}
        <main className="flex-1 bg-white p-4">
          <Outlet />
        </main>
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
