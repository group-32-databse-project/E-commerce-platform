import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const drawerWidth = 24;

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          marginLeft: `${drawerWidth}px`, // Ensures content is right to the sidebar
        }}
      >
        {/* Dynamic Content Based on Route */}
        <Outlet />
      </Box>
    </Box>
  );
}
