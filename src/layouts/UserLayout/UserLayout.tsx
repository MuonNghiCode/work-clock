import React from "react";
import AdminHeader from "../Header/AdminHeader/AdminHeader";
import UserSidebar from "../Sidebar/UserSidebar/UserSidebar";
import { Outlet } from "react-router";

const UserLayout: React.FC = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="bg-white text-black text-center p-8 shadow-[0_5px_5px_rgba(255,145,77,0.2)] relative">
          <AdminHeader />
        </header>
        <div className="flex flex-1 ">
          <aside className="relative bg-white text-black shadow-[10px_0_10px_rgba(255,145,77,0.2)]">
            <UserSidebar />
          </aside>
          <main className="flex-1 p-6 bg-brand-orange-light">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
