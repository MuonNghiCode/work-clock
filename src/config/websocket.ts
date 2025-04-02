let socket: WebSocket | null = null;
let reconnectInterval: number | null = null;

export const connectWebSocket = (
    userId: string,
    onMessage: (message: string) => void,
    onError?: (error: Event) => void
) => {
    socket = new WebSocket(`ws://localhost:8080?user=${userId}`);

    socket.onopen = () => {
        console.log('✅ Connected to WebSocket');
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessage(data.message);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
    };

    socket.onclose = () => {
        console.log('❌ WebSocket Disconnected');
        attemptReconnect(userId, onMessage, onError);
    };
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
};

export const sendMessage = (message: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open. Unable to send message.');
    }
};

const attemptReconnect = (
    userId: string,
    onMessage: (message: string) => void,
    onError?: (error: Event) => void
) => {
    if (!reconnectInterval) {
        reconnectInterval = window.setInterval(() => {
            console.log('🔄 Attempting to reconnect to WebSocket...');
            connectWebSocket(userId, onMessage, onError);
        }, 5000); // Retry every 5 seconds
    }
};
