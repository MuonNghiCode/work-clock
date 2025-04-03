import React, { useEffect, useState } from 'react';
import { Divider, List } from 'antd';
import { Notification } from '../../types/Notification';
import { formatDate } from '../../utils/formatDate';

interface NotificationDropdownProps {
    userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`https://websocket-notification-mongodb.onrender.com/?userId=${userId}`);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            setNotifications((prev) => [newNotification, ...prev]);
            notifications.map((notification) => {
                return notification;
            }
            );
        };
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            socket.close();
        };
    }, [userId]);

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            {notifications.length > 0 ? (
                <List className='overflow-y-scroll h-fit max-h-96 !w-full !min-w-fit !flex justify-center !p-2 my-2' dataSource={notifications} renderItem={(notification) => (
                    <List.Item
                        key={notification.id}
                        className="!w-full flex !justify-center items-center !rounded-xl !my-2 !p-2 border-1 border-gray-300"
                    >
                        <div className="!w-full flex items-center justify-center hover:text-blue-400 hover:underline" >
                            {notification.message} <Divider type="vertical" className='mx-2' /> <span className='text-gray-300'>{formatDate(notification.createdAt)}</span>
                        </div>
                    </List.Item>
                )}

                />
            )
                : (
                    <div>No notifications</div>
                )}
        </div>
    );
};

export default NotificationDropdown;