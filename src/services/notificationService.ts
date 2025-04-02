
// Send a notification via WebSocket
export const sendNotification = (receivedId: string, message: string, type: string) => {
    const socket = new WebSocket("ws://localhost:8080"); // Replace with your WebSocket server URL
    socket.onopen = () => {
        const notification = {
            userId: receivedId, // Notify the approver
            message: message,
            type: type,
            timestamp: new Date(Date.now()).toISOString(),
            read: false,
        };
        socket.send(JSON.stringify(notification));
        socket.close(); // Close the connection after sending
    };
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
}
