import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import "@fontsource/poppins"; // Import Poppins font

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import ArrowBackIcon
import getCheckoutTheme from "../../theme/getCheckoutTheme";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
  backgroundImage: "none",
  zIndex: theme.zIndex.drawer + 1,
  flex: "0 0 auto",
  // Remove upper margin if any
  marginTop: 0,
}));

function TemplateFrame({ mode, children }) {
  const checkoutTheme = createTheme({
    ...getCheckoutTheme(mode),
    typography: {
      fontFamily: "Poppins, Arial",
      // You can customize other typography settings here
    },
  });

  const handleBack = () => {
    // Define your back button functionality here
    window.history.back();
  };

  return (
    <ThemeProvider theme={checkoutTheme}>
      <Box
        sx={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          marginTop: 0,
        }}
      >
        <StyledAppBar>
          <Toolbar
            variant="dense"
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              p: "8px 12px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBack}
            >
              <ArrowBackIcon />
            </IconButton>
            {/* You can add Toolbar content here if needed */}
          </Toolbar>
        </StyledAppBar>
        <Box sx={{ flex: "1 1", overflow: "auto", paddingTop: 0 }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

TemplateFrame.propTypes = {
  children: PropTypes.node,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  showCustomTheme: PropTypes.bool.isRequired,
  toggleColorMode: PropTypes.func.isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default TemplateFrame;
