import React from "react";
import AdminHeader from "../Header/AdminHeader/AdminHeader";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const ApprovalLayout: React.FC = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="bg-white w-full inline-flex justify-between items-center text-black text-center lg:p-8 p-4 shadow-[0_5px_5px_rgba(255,145,77,0.2)] relative z-99">
          <AdminHeader />
        </header>
        <div className="lg:flex flex-1 ">
          <aside className="relative bg-white text-black shadow-[10px_0_10px_rgba(255,145,77,0.2)] z-99">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ApprovalLayout;
