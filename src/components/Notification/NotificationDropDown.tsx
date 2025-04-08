import React, { useEffect, useState } from "react";
import { Divider, List } from "antd";
import { Notification } from "../../types/Notification";
import { formatDate } from "../../utils/formatDate";
import { BellOutlined } from "@ant-design/icons";

interface NotificationDropdownProps {
  userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userId,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket = new WebSocket(
      `https://websocket-notification-mongodb.onrender.com/?userId=${userId}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
      notifications.map((notification) => {
        return notification;
      });
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
    <div className="w-full flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
        <BellOutlined className="text-[#FF914D] text-2xl" />
      </div>

      {notifications.length > 0 ? (
        <List
          className="h-auto max-h-[800px] w-full flex flex-col space-y-2 "
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              key={notification.id}
              className="w-full flex justify-between gap-2 items-center rounded-xl p-4 bg-gray-50 
                hover:bg-[#FF914D]/50  hover:text-white 
                transition-all duration-300 border border-gray-200 shadow-md cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="font-medium whitespace-pre-line">
                {notification.message.split(".").map((sentence, index) => (
                  <span key={index}>
                    {sentence.trim()}
                    {index !== notification.message.split(".").length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
              </div>
              <Divider type="vertical" className="mx-2 border-gray-300" />
              <span className="text-gray-500 text-sm group-hover:text-white">
                {formatDate(notification.createdAt)}
              </span>
            </List.Item>
          )}
        />
      ) : (
        <div className="text-gray-500 text-lg font-medium text-center py-4">
          No notifications
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
