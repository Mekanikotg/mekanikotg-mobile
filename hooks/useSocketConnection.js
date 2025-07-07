import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const useSocketConnection = () => {
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('https://mekaniko-socket.onrender.com');
        newSocket.connect();

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            setIsSocketConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsSocketConnected(false);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    const addSocketListener = (eventName, callback) => {
        if (socket) {
            socket.on(eventName, callback);
        }
    };

    const removeSocketListener = (eventName, callback) => {
        if (socket) {
            socket.off(eventName, callback);
        }
    };

    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    return {
        isSocketConnected,
        addSocketListener,
        removeSocketListener,
        sendMessage // Corrected the return value here
    };
};
