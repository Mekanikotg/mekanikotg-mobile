import io from 'socket.io-client';

const socket = io('https://mekaniko-socket.onrender.com');

const connectSocket = () => {
  socket.connect();

  // socket.on('connect', () => {
  //   console.log('Connected to socket server');
  // });

  // socket.on('disconnect', () => {
  //   console.log('Disconnected from socket server');
  // });

  return socket;
};

export default connectSocket;
