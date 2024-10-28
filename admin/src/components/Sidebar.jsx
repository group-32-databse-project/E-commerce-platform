import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Divider, Box } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("Name");
    localStorage.removeItem("customerId");
    navigate("/signin");
    window.location.reload(); // Ensure App re-evaluates authentication
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ overflow: "auto", padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
            {localStorage.getItem("Name")?.[0] || "A"}
          </Avatar>
          <Typography variant="h6">
            {localStorage.getItem("Name") || "Admin"}
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button component={Link} to="/home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
          <ListItem button component={Link} to="/products">
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>
          <ListItem button component={Link} to="/sales-report">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Report" />
          </ListItem>
        </List>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}
