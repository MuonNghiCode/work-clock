import React from "react";
import AdminHeader from "../Header/AdminHeader/AdminHeader";
import FinanceSidebar from "../Sidebar/FinanceSidebar/FinanceSidebar";
import { Outlet } from "react-router";

const FinanceLayout: React.FC = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="bg-white text-black text-center p-4 shadow-[0_5px_5px_rgba(255,145,77,0.2)] relative">
          <AdminHeader />
        </header>
        <div className="flex flex-1 ">
          <aside className="relative bg-white text-black shadow-[10px_0_10px_rgba(255,145,77,0.2)]">
            <FinanceSidebar />
          </aside>
          <main className="flex-1 bg-gray-100 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default FinanceLayout;
