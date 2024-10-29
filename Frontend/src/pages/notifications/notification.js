import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  Loyalty,
  MonetizationOn,
  NotificationsActive,
} from "@mui/icons-material";
import { fetchNotifications, markAsRead } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";



const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { authToken } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (authToken) {
      getNotifications();
    }

    // Polling interval (e.g., every 30 seconds)
    const interval = setInterval(() => {
      if (authToken) {
        getNotifications();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [authToken]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(authToken, notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId ? { ...notif, is_read: 1 } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const determineNotificationType = (message) => {
    if (message.toLowerCase().includes("shipped")) return "shipping";
    if (message.toLowerCase().includes("delivered")) return "refund"; // Example
    if (message.toLowerCase().includes("placed")) return "order";
    // Add more conditions as needed
    return "order";
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCart />;
      case "shipping":
        return <LocalShipping />;
      case "promotion":
        return <Loyalty />;
      case "refund":
        return <MonetizationOn />;
      default:
        return <NotificationsActive />;
    }
  };

  const navigateToOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.length === 0 ? (
              <Typography variant="body1">No notifications yet.</Typography>
            ) : (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.notification_id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      backgroundColor: notification.is_read ? "inherit" : "#f0f0f0",
                      cursor: "pointer",
                    }}
                    onClick={() => navigateToOrder(notification.order_id)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getNotificationIcon(determineNotificationType(notification.message))}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    {!notification.is_read && (
                      <Button
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the onClick of ListItem
                          handleMarkAsRead(notification.notification_id);
                        }}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default NotificationPage;
