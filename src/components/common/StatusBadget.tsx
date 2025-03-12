import React from 'react';
import { User } from '../../pages/AdminPage/AdminUser/AdminUserManagement';

interface StatusBadgeProps {
  type: 'status' | 'role';
  user?: User<string>;
  value?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, user, value }) => {
  if (type === 'role') {
    const roleColors = {
      'A001': 'bg-purple-100 text-purple-800',
      'A002': 'bg-blue-100 text-blue-800',
      'A003': 'bg-green-100 text-green-800',
      'A004': 'bg-orange-100 text-orange-800',
    };
    
    const roleName = {
      'A001': 'Admin',
      'A002': 'Finance',
      'A003': 'Approval',
      'A004': 'Claimer',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[value as keyof typeof roleColors]}`}>
        {roleName[value as keyof typeof roleName] || value}
      </span>
    );
  }

  if (user) {
    if (user.is_deleted) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Deleted</span>;
    }
    if (!user.is_verified) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Unverified</span>;
    }
    return user.is_blocked ? 
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Blocked</span> :
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
  }

  return null;
};

export default StatusBadge; 