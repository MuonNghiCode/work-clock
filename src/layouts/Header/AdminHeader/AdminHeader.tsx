import React from "react";
import { useUser } from "../../../context/UserContext";
import Images from "../../../components/images";
import Icons from "../../../components/icon";
import { Dropdown, Space } from "antd";
import type { MenuProps } from 'antd';


const AdminHeader: React.FC = () => {
  const { user } = useUser();
  const { User, DropDownIcon } = Icons;

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: user?.name || 'Guest',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Profile',
    },
    {
      key: '3',
      label: 'Billing',
    },
    {
      key: '4',
      label: 'Settings',
    },
  ];

  return (
    <>
      <div className="flex bg-transparent justify-between items-center">
        <div className="h-18 flex items-center py-4 px-6">
          <img src={Images.Logo} alt="logo" className="max-w-64 h-25" />
        </div>
        <div>
          {user ? <div>Welcome, {user.name}</div> : <div>Welcome, Guest</div>}
        </div>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <User />
            </Space>
          </a>
        </Dropdown>

      </div>
    </>
  );
};

export default AdminHeader;
