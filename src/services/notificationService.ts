// Send a notification via WebSocket
export const sendNotification = (receivedId: string, message: string, type: string) => {
    const socket = new WebSocket(`https://websocket-notification-mongodb.onrender.com/?userId=${receivedId}`); // Replace with your WebSocket server URL

    socket.onopen = () => {
        const notification = {
            userId: receivedId, // Notify the approver
            message: message,
            type: type,
            timestamp: new Date(Date.now()).toISOString(),
            read: false,
        };
        socket.send(JSON.stringify(notification));
        console.log("Notification sent successfully", notification);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log("WebSocket connection closed cleanly");
        } else {
            console.warn("WebSocket connection closed unexpectedly");
        }
    };

    // Close the WebSocket connection after a delay to ensure the message is sent
    setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
    }, 1000); // Adjust the delay as needed
};
