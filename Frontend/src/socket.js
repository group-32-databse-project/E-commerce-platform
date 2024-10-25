import { io } from "socket.io-client";

// Function to retrieve the authentication token (replace with your auth logic)
const getAuthToken = () => {
  return localStorage.getItem("authToken"); // Adjust as per your auth implementation
};

// Initialize Socket.io client with authentication
const socket = io(process.env.REACT_APP_SOCKET_IO_URL || "http://localhost:5001", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  auth: {
    token: getAuthToken(),
  },
});

// Function to join a user-specific room
export const joinRoom = (userId) => {
  if (userId) {
    socket.emit("join", userId);
    console.log(`Joined room: user_${userId}`);
  }
};

// Function to listen for new notifications
export const listenForNotifications = (callback) => {
  socket.on("new_notification", (notification) => {
    callback(notification);
  });

  // Handle error messages from server
  socket.on("error_message", (data) => {
    console.error("Server Error:", data.message);
  });
};

// Function to disconnect Socket.io
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
