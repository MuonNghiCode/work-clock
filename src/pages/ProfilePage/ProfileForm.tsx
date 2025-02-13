import React, { useState } from 'react';
import { User } from './User';

interface ProfileFormProps {
    user: User;
    onSave: (updatedUser: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave }) => {
    const [formData, setFormData] = useState<User>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Contact Number</label>
                <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </div>
            <button type="submit">Save Changes</button>
        </form>
    );
};

export default ProfileForm;