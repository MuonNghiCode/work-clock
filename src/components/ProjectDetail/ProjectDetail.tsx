import React from "react";
import { ProjectInfo } from "../../types/Project";
import Modal from "../Modal/Modal";

interface ProjectDetailProps {
  visible: boolean;
  onClose: () => void;
  Project: ProjectInfo | null;
  users: string[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  visible,
  onClose,
  Project,
}) => {
  if (!Project) return null;

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <div className="w-[1000px] max-w-full px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Project Detail</h2>

        <div className="flex flex-col items-center gap-y-4">
          <div className="w-full space-y-4">
            <div className="flex flex-row justify-between w-full space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">Project Name</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project.project_name}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">Project Code</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project._id}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between w-full space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">Start Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project.project_start_date}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">End Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project.project_end_date}
                </div>
              </div>
            </div>


            <div className="flex flex-row justify-between w-full space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">Department</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project.project_department || "N/A"}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">User</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
                  {Project.project_members || "dngoc"}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between w-full space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-gray-700 font-medium text-lg">Status</label>
                <div className={`w-1/2 px-4 py-2 rounded-lg text-base text-center font-medium
                  ${Project.project_status === 'Processing' ? 'bg-[#F4ECFF] text-[#7B2CBF]' :
                    Project.project_status === 'Pending' ? 'bg-[#FFE2E5] text-[#FF0420]' :
                      'bg-[#E6FAF5] text-[#00B087]'}`}
                >
                  {Project.project_status}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors text-base"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetail;