import React from "react";
import { Outlet } from "react-router";
import MainHeader from "../Header/MainHeader/MainHeader";
import Footer from "../Footer/Footer";
const MainLayout: React.FC = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="relative bg-white text-black text-center p-4 shadow-[0_10px_5px_rgba(255,145,77,0.2)]">
          <MainHeader />
        </header>
        <main className="flex-1 bg-gray-200 p-4">
          <Outlet />
        </main>
        <footer className="z-10 bg-white text-black text-center p-4 shadow-[0_-10px_5px_rgba(255,145,77,0.2)]">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default MainLayout;
