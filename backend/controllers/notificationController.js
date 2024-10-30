const Notification = require('../models/Notification');

class NotificationController {
  /**
   * Get notifications for the authenticated user.
   * Assumes that authentication middleware sets req.user to the authenticated user.
   */
  static async getUserNotifications(req, res) {
    try {
      const customerId = req.customer.id; // Ensure your authentication middleware sets req.user
      const notifications = await Notification.getNotificationsByUserId(
        customerId
      );
      res.json({ success: true, notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  /**
   * Mark a specific notification as read.
   */
  static async markNotificationAsRead(req, res) {
    try {
      const notificationId = req.params.id;
      await Notification.markAsRead(notificationId);
      res.json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}

module.exports = NotificationController;

