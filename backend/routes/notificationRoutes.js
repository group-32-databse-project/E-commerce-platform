const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

// Get notifications for a user
router.get('/user/:userId', NotificationController.getUserNotifications);

// Mark a notification as read
router.put('/read/:id', NotificationController.markAsRead);

module.exports = router;
