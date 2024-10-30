import axios from "axios";

// Base URL for the notifications API
const API_URL = "http://localhost:5001/api/notifications"; // Replace with your backend URL if different

/**
 * Fetch notifications for the authenticated user.
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<Array>} - List of notifications.
 */
export const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000, // 10 seconds timeout
    });
    return response.data.notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark a specific notification as read.
 * @param {string} token - The JWT token for authentication.
 * @param {number} notificationId - The ID of the notification to mark as read.
 * @returns {Promise<Object>} - Response from the server.
 */
export const markAsRead = async (token, notificationId) => {
  try {
    const response = await axios.patch(`${API_URL}/${notificationId}/read`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

