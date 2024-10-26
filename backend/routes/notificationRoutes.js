const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const authenticate = require('../middlewares/authenticate'); // New authentication middleware

// Apply authentication middleware to all notification routes
router.use(authenticate);

// GET /api/notifications - Retrieve all notifications for the authenticated user
router.get('/', NotificationController.getUserNotifications);

// PATCH /api/notifications/:id/read - Mark a specific notification as read
router.patch('/:id/read', NotificationController.markNotificationAsRead);

module.exports = router;
