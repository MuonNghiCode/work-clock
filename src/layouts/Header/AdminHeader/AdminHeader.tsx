import React from "react";
import { useUser } from "../../../context/UserContext";

const AdminHeader: React.FC = () => {
  const { user } = useUser();

  return (
    <div>
      <div>Admin Header</div>
      {user ? <div>Welcome, {user.name}</div> : <div>Welcome, Guest</div>}
    </div>
  );
};

export default AdminHeader;
