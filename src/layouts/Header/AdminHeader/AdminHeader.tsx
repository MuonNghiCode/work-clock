import React from "react";
import { useUser } from "../../../contexts/UserContext";
import Images from "../../../components/images";
import Icons from "../../../components/icon";
import { Dropdown, Badge, Button } from "antd";
import type { MenuProps } from "antd";
import { useSidebarStore } from "../../../config/zustand";

const AdminHeader: React.FC = () => {
  const { user } = useUser();
  const { toggleSidebar } = useSidebarStore();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: 'Welcome back' + " " + `${user?.name || "Guest"}` + " !",
      disabled: true,
    },
    {
      type: "divider",
      className: 'lg:!hidden'
    },
    {
      key: "2",
      label: "Profile",
    },
    {
      key: "3",
      label: <span className="lg:hidden inline-flex items-center">Settings
        <Icons.Settings className="w-4 h-4 !ml-1" />
      </span>,
      className: 'lg:!hidden'
    },
    {
      type: "divider",
      className: 'lg:!hidden'
    },
    {
      key: "4",
      label:
        <a href="#">
          <div className="inline-flex items-center">
            Dashboard <Icons.Dashboard
              strokeWidth={1.5}
              className="w-4 h-4 ml-1"
            />
          </div>
        </a>,
      className: 'lg:!hidden'
    },
    {
      key: "5",
      label: <>
        <a href="#" className="lg:hidden inline-flex items-center">
          Report
          <Icons.ChartColumn
            strokeWidth={1.5}
            className="w-4 h-4 ml-1"
          />
        </a>
      </>,
      className: 'lg:!hidden'

    },
    {
      type: "divider",
      className: 'lg:!hidden'
    },
    {
      key: "6",
      label: <div className="">
        <span className="lg:!hidden">
          <hr className="py-2 border-gray-300 lg:hidden" />
        </span>
        <span className="lg:hidden">
          <Badge count={5} className="!pr-2">
            <div className="inline-flex items-center">
              Notification
              <Icons.Bell
                strokeWidth={1.5}
                className="w-4 h-4 ml-1"
              />
            </div>
          </Badge>
        </span>
      </div>,
      className: 'lg:!hidden'

    },
    {
      key: "7",
      label: <span className="lg:hidden inline-flex items-center">
        Help
        <Icons.Help
          strokeWidth={1.5}
          className="w-4 h-4 lg:hidden ml-1"
        />
      </span>,
      className: 'lg:!hidden'
    },
    {
      key: "8",
      label: <a href="/login" className="inline-flex items-center lg:hidden">
        Logout
        <Icons.LogOut className="w-4 h-4 ml-1" />
      </a>,
      className: 'lg:!hidden'

    }
  ];

  return (
    <>
      <div className="h-8 lg:h-12 w-full flex items-center lg:py-4 lg:space-x-7 !-pl-4">
        <Button
          onClick={toggleSidebar}
          className="!h-fit !p-3 !border-none hover:!shadow-lg !text-black !hidden lg:!flex"
        >
          <Icons.Menu strokeWidth={2.5} className="w-8 h-8" />
        </Button>
        <img src={Images.Logo} alt="logo" className="lg:max-w-64 lg:h-25 max-w-40" />
      </div>
      <div className="w-full flex justify-end items-center space-x-12 mr-5">
        <div className="w-12 h-12 lg:block hidden">
          <Badge count={5} className="">
            <Icons.Bell
              strokeWidth={2.5}
              className="lg:w-12 lg:h-12 w-8 h-8 text-gray-300 hover:scale-110"
            />
          </Badge>
        </div>
        <Icons.Help
          strokeWidth={2.5}
          className="w-12 h-12 lg:block hidden text-gray-300 hover:scale-110"
        />
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomLeft"
          overlayClassName="!w-60 !font-squanda"
          arrow
          autoAdjustOverflow
          className="flex items-center "
        >
          <a
            onClick={(e) => e.preventDefault()}
            className="w-12 h-12 bg-brand-grandient text-white rounded-full hover:scale-110"
          >
            {user ? (
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="user"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <Icons.UserAdmin className="w-12 h-12" strokeWidth={2.5} />
            )}
          </a>
        </Dropdown>
      </div>
    </>
  );
};

export default AdminHeader;
