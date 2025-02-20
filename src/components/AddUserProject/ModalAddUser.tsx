import React from "react";
import { Modal } from "antd";

const ModalAddUser: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">Row {index + 1} - Col 1</td>
                <td className="border border-gray-300 px-2 py-1">Row {index + 1} - Col 2</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default ModalAddUser;