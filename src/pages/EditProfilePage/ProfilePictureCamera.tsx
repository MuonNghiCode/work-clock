import React, { useRef } from "react";

interface ProfilePictureCameraProps {
    userImage: string;
    setUserImage: (image: string) => void;
}

const ProfilePictureCamera: React.FC<ProfilePictureCameraProps> = ({ userImage, setUserImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result as string;
                setUserImage(imageDataUrl);
                localStorage.setItem("userImage", imageDataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <img src={userImage} alt="User Avatar" className="w-32 h-32 rounded-full object-cover border" />
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
        </div>
    );
};

export default ProfilePictureCamera;
