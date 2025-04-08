import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../config/websocket';
import { Notification } from '../types/Notification';

const useNotifications = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleNewMessage = (message: string) => {
        const newNotification: Notification = JSON.parse(message);
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    useEffect(() => {
        connectWebSocket(userId, handleNewMessage);
        return () => {
            disconnectWebSocket();
        };
    }, [userId]);

    return notifications;
};

export default useNotifications;