import React, { useRef, useState } from "react";

interface ProfilePictureCameraProps {
  userImage: string;
  setUserImage: (image: string) => void;
}

const ProfilePictureCamera: React.FC<ProfilePictureCameraProps> = ({
  userImage,
  setUserImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setUserImage(imageDataUrl);
        localStorage.setItem("userImage", imageDataUrl);
        console.log(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Ảnh đại diện */}
      <img
        src={userImage}
        alt="User Avatar"
        className="w-32 h-32 rounded-full object-cover border cursor-pointer"
        onClick={toggleModal}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Image
      </button>

      {/* Modal phóng to ảnh */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative">
            <img
              src={userImage}
              alt="Enlarged Avatar"
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-gray-800 bg-opacity-70 rounded-full p-1"
              onClick={toggleModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureCamera;
