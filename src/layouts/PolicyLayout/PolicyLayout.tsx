import React, { useRef, useState } from "react";
import ClickSpark from "../../components/ClickSpark/ClickSpark";
import Policy from "../../pages/PrivatePolicy/Policy";
import Icons from "../../components/icon";

const PolicyLayout: React.FC = () => {
  const dataCollectionRef = useRef<HTMLDivElement>(null);
  const purposeRef = useRef<HTMLDivElement>(null);
  const dataUsageRef = useRef<HTMLDivElement>(null);
  const dataSharingRef = useRef<HTMLDivElement>(null);
  const dataSecurityRef = useRef<HTMLDivElement>(null);
  const userRightsRef = useRef<HTMLDivElement>(null);
  const contactUsRef = useRef<HTMLDivElement>(null);
  const dataRetentionRef = useRef<HTMLDivElement>(null);
  const cookiesPolicyRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setShowModal(true);
  };

  const confirmNavigation = () => {
    window.location.href = "/";
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex h-full">
      {/* Accordion Navigation */}
      <div className="w-1/5 p-4 bg-gray-100 border-r border-gray-300 sticky top-0 h-screen overflow-y-auto flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-[#03346E]">
            Policy Sections
          </h1>
          <ul className="space-y-2">
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(dataCollectionRef)}
              >
                Data Collection
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(purposeRef)}
              >
                Purpose of Data Collection
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(dataUsageRef)}
              >
                Data Usage
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(dataSharingRef)}
              >
                Data Sharing
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(dataSecurityRef)}
              >
                Data Security
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(userRightsRef)}
              >
                User Rights
              </button>
            </li>
            <li>
              <button
                className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37]"
                onClick={() => scrollToSection(contactUsRef)}
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>
        <button
          className="text-left w-full py-2 px-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-400 focus:text-[#3C3D37] transition text-[#3C3D37] flex items-center"
          onClick={handleBackToHome}
        >
          <Icons.LogOut className="mr-2" />
          Back to Home
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <ClickSpark
          sparkColor="#ff914d"
          sparkSize={15}
          sparkRadius={30}
          sparkCount={8}
          duration={400}
        >
          <Policy
            refs={{
              dataCollectionRef,
              purposeRef,
              dataUsageRef,
              dataSharingRef,
              dataSecurityRef,
              userRightsRef,
              contactUsRef,
              dataRetentionRef,
              cookiesPolicyRef,
            }}
          />
        </ClickSpark>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Navigation</h2>
            <p>Are you sure you want to go back to the home page?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#ff914d] text-white rounded-lg hover:bg-[#ff914d]"
                onClick={confirmNavigation}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyLayout;
