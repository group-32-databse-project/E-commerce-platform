const db = require('../config/database');

class Notification {
  /**
   * Fetch notifications for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} - List of notifications.
   */
  static async getNotificationsByUserId(userId) {
    console.log(`getNotificationsByUserId: Fetching notifications for user ID: ${userId}`);
    
    const query = `
      SELECT n.notification_id, n.order_id, n.message, n.is_read, n.created_at
      FROM notifications n
      JOIN shop_order so ON n.order_id = so.order_id
      WHERE so.user_id = ?
      ORDER BY n.created_at DESC
    `;
    
    
    try {
      const [rows] = await db.query(query, [userId]);
      console.log(`getNotificationsByUserId: Retrieved ${rows.length} notifications for user ID: ${userId}`);
      console.log('getNotificationsByUserId: Notifications:', rows);
      return rows;
    } catch (error) {
      console.error(`getNotificationsByUserId: Error fetching notifications for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a notification as read.
   * @param {number} notificationId - The ID of the notification.
   * @returns {Promise<void>}
   */
  static async markAsRead(notificationId) {
    console.log(`markAsRead: Marking notification ID: ${notificationId} as read.`);
    
    const query = `UPDATE notifications SET is_read = 1 WHERE notification_id = ?`;
    
    try {
      const [result] = await db.query(query, [notificationId]);
      if (result.affectedRows > 0) {
        console.log(`markAsRead: Successfully marked notification ID ${notificationId} as read.`);
      } else {
        console.warn(`markAsRead: No notification found with ID ${notificationId}.`);
      }
    } catch (error) {
      console.error(`markAsRead: Error marking notification ID ${notificationId} as read:`, error);
      throw error;
    }
  }

  /**
   * (Optional) Create a new notification.
   * Useful for testing purposes.
   * @param {number} userId - The ID of the user.
   * @param {string} message - The notification message.
   * @returns {Promise<number>} - The ID of the newly created notification.
   */
  static async createNotification(userId, orderId, message) {
    console.log(`createNotification: Creating notification for user ID: ${userId}, order ID: ${orderId}`);
    
    const query = `
      INSERT INTO notifications (user_id, order_id, message, is_read, created_at)
      VALUES (?, ?, ?, 0, NOW())
    `;
    
    try {
      const [result] = await db.query(query, [userId, orderId, message]);
      console.log(`createNotification: Notification created with ID: ${result.insertId}`);
      return result.insertId;
    } catch (error) {
      console.error(`createNotification: Error creating notification for user ID ${userId}:`, error);
      throw error;
    }
  }
  
  // Add more methods as needed with similar logging
}

module.exports = Notification;

