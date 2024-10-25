import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import {
  ShoppingCart,
  LocalShipping,
  Loyalty,
  MonetizationOn,
} from "@mui/icons-material";
import {
  listenForNotifications,
  joinRoom,
  disconnectSocket,
} from "../../socket";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null); // Replace with actual user ID from authentication

  useEffect(() => {
    // Replace with your actual authentication logic to get the user ID
    const fetchUserId = async () => {
      // Example: Fetch user data from auth context or global state
      const fetchedUserId = 1; // Replace with dynamic user ID
      setUserId(fetchedUserId);
      joinRoom(fetchedUserId);
    };

    fetchUserId();

    // Listen for new notifications
    listenForNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // Optionally, trigger browser notifications or UI updates here
      console.log("New Notification:", notification);
    });

    // Cleanup on component unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  // Function to dynamically select the appropriate icon based on notification type
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
        return <ShoppingCart />;
    }
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
                <React.Fragment key={notification.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
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
