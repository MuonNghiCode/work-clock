import React from 'react';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileImageUploader from './ProfileImageUploader';
import { User } from './User';

const EditProfile: React.FC = () => {
    const user: User = {
        firstName: 'Mehrab',
        lastName: 'Bozorgi',
        email: 'Mehrabbozorgi.business@gmail.com',
        contactNumber: '58077.79'
    };

    const handleSave = (updatedUser: User) => {
        // Handle save logic here
        console.log('Updated User:', updatedUser);
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <ProfileImageUploader />
            <ProfileForm user={user} onSave={handleSave} />
            <ChangePasswordForm />
        </div>
    );
};

export default EditProfile;