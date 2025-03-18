import React from "react";
import AdminHeader from "../Header/AdminHeader/AdminHeader";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const ApprovalLayout: React.FC = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden ">
        <aside className="flex-shrink-0 flex flex-col">
          <Sidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden bg-brand-orange-light rounded-tl-3xl rounded-bl-3xl">
          <header>
            <AdminHeader />
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ApprovalLayout;
