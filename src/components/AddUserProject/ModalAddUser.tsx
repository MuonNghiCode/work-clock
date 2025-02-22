import React, { useState } from "react";
import { Modal } from "antd";

const ModalAddUser: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [rows, setRows] = useState<{ dngoc: string; admin: string }[]>([
    { dngoc: "Dngoc 1", admin: "Admin 1" }
  ]);

  const handleAddRow = () => {
    const newRowIndex = rows.length + 1;
    setRows([...rows, { dngoc: `Dngoc ${newRowIndex}`, admin: `Admin ${newRowIndex}` }]);
  };

  return (
    <Modal title="Add New User" visible={isOpen} onCancel={onClose} footer={null}>
      <div className="flex justify-center">
        {/* Bảng 1 */}
        <table className="border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Column 1</th>
              <th className="border border-gray-300 px-2 py-1">Column 2</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">{row.dngoc}</td>
                <td className="border border-gray-300 px-2 py-1">{row.admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddRow} // Gọi hàm thêm hàng mới
        >
          Add User
        </button>
      </div>
    </Modal>
  );
};

export default ModalAddUser;