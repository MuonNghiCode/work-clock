import React, { useState } from "react";
import { Modal } from "antd";

interface ModalAddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAddUser: React.FC<ModalAddUserProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<{ name: string; role: string }[]>([
    { name: "ntdn", role: "Admin" },
    { name: "dnxd", role: "Editor" },
  ]);
  const [newUser, setNewUser] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<string>("");

  const handleAddUser = () => {
    if (newUser.trim() && newUserRole.trim()) {
      setUsers([...users, { name: newUser.trim(), role: newUserRole.trim() }]);
      setNewUser("");
      setNewUserRole("");
    }
  };

  const handleDeleteUser = (userToDelete: string) => {
    setUsers(users.filter((user) => user.name !== userToDelete));
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add New User"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter new user name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            placeholder="Enter user role"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          className="w-full bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          onClick={handleAddUser}
        >
          Add User
        </button>
        <table className="w-full border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="text-center border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteUser(user.name)}
                    className="text-orange-500 hover:text-orange-700 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ModalAddUser;
