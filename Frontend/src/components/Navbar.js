import React, { useState } from "react";
import { Box, Menu, MenuItem, styled, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Styled Component for Navigation Buttons
const NavButton = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  color: "#333333",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Navbar = ({ navigationLinks }) => {
  const theme = useTheme();
  const [openNavMenu, setOpenNavMenu] = useState(null); // Tracks which menu is open
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the menu

  // Handler to open dropdown menu
  const handleNavMenuOpen = (event, menuName) => {
    setAnchorEl(event.currentTarget);
    setOpenNavMenu(menuName);
  };

  // Handler to close dropdown menu
  const handleNavMenuClose = () => {
    setAnchorEl(null);
    setOpenNavMenu(null);
  };

  return (
    <Box component="nav" sx={{ display: "flex", alignItems: "center" }}>
      {navigationLinks.map((item) =>
        item.hasDropdown ? (
          <Box
            key={item.name}
            sx={{ position: "relative" }}
            onMouseEnter={(e) => handleNavMenuOpen(e, item.name)}
            onMouseLeave={handleNavMenuClose}
          >
            <NavButton
              aria-controls={
                openNavMenu === item.name ? `nav-menu-${item.name}` : undefined
              }
              aria-haspopup="true"
              aria-expanded={openNavMenu === item.name ? "true" : undefined}
              sx={{ paddingY: 1, px: 2, fontWeight: 500, fontSize: "1rem" }}
            >
              {item.name} <ExpandMoreIcon fontSize="small" />
            </NavButton>
            <Menu
              id={`nav-menu-${item.name}`}
              anchorEl={anchorEl}
              open={openNavMenu === item.name}
              onClose={handleNavMenuClose}
              MenuListProps={{
                onMouseEnter: () => setOpenNavMenu(item.name),
                onMouseLeave: handleNavMenuClose,
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                mt: 1,
              }}
            >
              {item.dropdownItems.map((subItem) => (
                <MenuItem
                  key={subItem.name}
                  component={Link}
                  to={subItem.link}
                  onClick={handleNavMenuClose}
                >
                  {subItem.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <NavButton
            key={item.name}
            component={Link}
            to={item.link}
            sx={{ paddingY: 1, px: 2, fontWeight: 500, fontSize: "1rem" }}
          >
            {item.name}
          </NavButton>
        )
      )}
    </Box>
  );
};

export default Navbar;
