import React, { useState } from "react";

const EditProfile: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "Mehrab",
        lastName: "Bozorgi",
        email: "mehrabbozorgi.business@gmail.com",
        contact: "58077.79",
    });

    const [image, setImage] = useState<string | null>(
        "https://via.placeholder.com/150" // Ảnh mặc định
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    return (
        <div>
            <div className="max-w-2xl mx-auto p-10 bg-white border rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

                <div className="flex flex-col md:flex-row gap-15 justify-between">
                    {/* Form chỉnh sửa */}
                    <div className="flex flex-col w-full gap-4">
                        <label className="flex flex-col">
                            <span className="font-semibold">First Name</span>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-2 border rounded-md"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-semibold">Last Name</span>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-2 border rounded-md"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-semibold">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="p-2 border bg-gray-200 rounded-md"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-semibold">Contact Number</span>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="p-2 border rounded-md"
                            />
                        </label>

                        <button className="mt-4 px-4 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-600">
                            Save Changes
                        </button>
                    </div>
                    {/* Ảnh đại diện */}
                    <div className="flex flex-col mx-auto ">
                        <img src={image!} alt="Profile" className="w-45 h-45 rounded-full border" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileInput" />
                        <label
                            htmlFor="fileInput"
                            className="mt-5 px-12 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
                        >
                            Choose Image
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-15 max-w-2xl mx-auto p-10 bg-white border rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Change password</h1>
                <div className="flex flex-col w-full gap-4">
                    <label className="flex flex-col">
                        <span className="font-semibold">Old password</span>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="p-2 border rounded-md"
                        />
                    </label>

                    <div className=" flex flex-col md:flex-row gap-5 justify-center">
                        <label className="flex flex-col w-full">
                            <span className="font-semibold">New password</span>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-2 border rounded-md"
                            />
                        </label>

                        <label className="flex flex-col w-full">
                            <span className="font-semibold">Confirm Password</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="p-2 border bg-gray-200 rounded-md"
                            />
                        </label>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-600">
                        Change Password
                    </button>
                </div>
            </div>
        </div>

    );
};

export default EditProfile;
