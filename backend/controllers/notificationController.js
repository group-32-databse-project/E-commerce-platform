// backend/controllers/NotificationController.js

const { executeQuery } = require('../utils/db');

/**
 * Get notifications for a specific user.
 */
async function getUserNotifications(req, res) {
    const userId = req.params.userId;

    const query = `
        SELECT id, user_id, order_id, message, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    try {
        const notifications = await executeQuery(query, [userId]);
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * Mark a notification as read.
 */
async function markAsRead(req, res) {
    const notificationId = req.params.id;

    const updateQuery = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
    `;

    try {
        const [result] = await executeQuery(updateQuery, [notificationId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Notification not found." });
        }

        return res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Error updating notification:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getUserNotifications,
    markAsRead,
};
