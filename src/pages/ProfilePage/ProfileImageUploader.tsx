import React, { useState } from 'react';

const ProfileImageUploader: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle image upload logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Choose Image</label>
                <input type="file" onChange={handleImageChange} />
            </div>
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default ProfileImageUploader;