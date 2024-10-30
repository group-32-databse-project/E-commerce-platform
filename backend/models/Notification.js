const db = require('../config/database');

class Notification {
  /**
   * Fetch notifications for a specific user using stored procedure.
   * @param {number} customerId - The ID of the customer.
   * @returns {Promise<Array>} - List of notifications.
   */
  static async getNotificationsByUserId(customerId) {
    try {
      const [rows] = await db.query('CALL get_notifications_by_user_id(?)', [customerId]);
      
      // The result of a CALL is nested within an array
      return rows[0];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read using stored procedure.
   * @param {number} notificationId - The ID of the notification.
   * @returns {Promise<void>}
   */
  static async markAsRead(notificationId) {
    try {
      await db.query('CALL mark_notification_as_read(?)', [notificationId]);
      console.log(`Notification ID ${notificationId} marked as read.`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Create a new notification using stored procedure.
   * @param {number} userId - The ID of the user.
   * @param {number} orderId - The ID of the order.
   * @param {string} message - The notification message.
   * @returns {Promise<number>} - The ID of the newly created notification.
   */
  static async createNotification(userId, orderId, message) {
    try {
      const [result] = await db.query('CALL create_notification(?, ?, ?)', [userId, orderId, message]);
      // Assuming the stored procedure returns the insertId as part of the result
      return result[0].insertId;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Add more methods as needed with similar logging and stored procedure calls
}

module.exports = Notification;