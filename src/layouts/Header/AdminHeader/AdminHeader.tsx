import React from "react";
import { useUser } from "../../../context/UserContext";
import Images from "../../../components/images";
import Icons from "../../../components/icon";
import { Dropdown, Badge, Button } from "antd";
import type { MenuProps } from 'antd';
import { useSidebarStore } from "../../../config/zustand";

const AdminHeader: React.FC = () => {
  const { user } = useUser();
  const { toggleSidebar } = useSidebarStore();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: user?.name || "Guest",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Profile",
    },
    {
      key: "3",
      label: "Billing",
    },
    {
      key: "4",
      label: "Settings",
    },
  ];

  return (
    <>
      <div className="flex bg-transparent justify-between items-center">
        <div className="h-12 flex items-center py-4 space-x-7 !-pl-4">
          <Button onClick={toggleSidebar} className="!h-fit !p-3 !border-none hover:!shadow-lg !text-black ">

            <Icons.Menu strokeWidth={2.5} className="w-12 h-12" />
          </Button>
          <img src={Images.Logo} alt="logo" className="max-w-64 h-25" />
        </div>
        <div className="inline-flex items-center space-x-12 mr-5">
          <div>
            <Badge count={5} className="">
              <Icons.Bell strokeWidth={2.5} className="w-12 h-12 text-gray-300 hover:scale-110" />
            </Badge>
          </div>
          <Icons.Help strokeWidth={2.5} className="w-12 h-12 text-gray-300 hover:scale-110" />
          <Dropdown menu={{ items }} trigger={['click']} className="flex items-center">
            <a onClick={(e) => e.preventDefault()} className="w-12 h-12 bg-brand-grandient text-white rounded-full hover:scale-110">
              {user ? (
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="user" className="w-12 h-12 rounded-full" />
              ) : (
                <Icons.UserAdmin className="w-12 h-12" strokeWidth={2.5} />
              )}
            </a>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
