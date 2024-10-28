import React from "react";
import { Typography, Box } from "@mui/material";

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to the Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Use the sidebar to navigate between different sections.
      </Typography>
    </Box>
  );
}

export default Home;