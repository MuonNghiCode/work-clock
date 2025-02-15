import React from "react";
import { Outlet, useLocation } from "react-router";
import MainHeader from "../Header/MainHeader/MainHeader";
import Footer from "../Footer/Footer";
import ApprovalPage from "../../pages/ApprovalPage/ApprovalPage";
const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="relative bg-white text-black text-center p-4 shadow-[0_10px_5px_rgba(255,145,77,0.2)]">
          <MainHeader />
        </header>
        <main className="flex-1 bg-gray-200 p-4">
          <ApprovalPage />
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
