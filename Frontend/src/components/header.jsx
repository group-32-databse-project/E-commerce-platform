import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Box,
  Container,
  Tooltip,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg"; // Ensure the path is correct
import { formatDistanceToNow } from "date-fns"; // Install via npm if not already

// Custom styles
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[200], 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[300], 1),
  },
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 3),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
      "&:focus": {
        width: "60ch",
      },
    },
  },
}));

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "space-between",
  ...theme.mixins.toolbar,
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [navAnchorEl, setNavAnchorEl] = useState(null);
  const [openNavMenu, setOpenNavMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      message: "Your order #1234 has been shipped.",
      time: new Date(),
      read: false,
    },
    {
      id: 2,
      type: "message",
      message: "New message from Support.",
      time: new Date(),
      read: false,
    },
    {
      id: 3,
      type: "promotion",
      message: "Your wishlist item is on sale!",
      time: new Date(),
      read: true,
    },
  ]);

  // State for Login Dialog

  // Handle Login Dialog
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
    setIsProfileMenuOpen(false);
  };

  const handleNavMenuOpen = (event, menuName) => {
    setNavAnchorEl(event.currentTarget);
    setOpenNavMenu(menuName);
  };

  const handleNavMenuClose = () => {
    setNavAnchorEl(null);
    setOpenNavMenu(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const categories = [
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Home & Garden" },
    { name: "Toys" },
    { name: "Sporting Goods" },
    { name: "Automotive" },
  ];

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Saved", link: "/saved" },
    ...categories.map((cat) => ({
      name: cat.name,
      link: `/${cat.name.toLowerCase()}`,
      hasDropdown: true,
      dropdownItems: [
        {
          name: `${cat.name} Subcategory 1`,
          link: `/${cat.name.toLowerCase()}/subcategory1`,
        },
        {
          name: `${cat.name} Subcategory 2`,
          link: `/${cat.name.toLowerCase()}/subcategory2`,
        },
      ],
    })),
    { name: "Deals", link: "/deals" },
    { name: "Contact", link: "/contact" },
    { name: "About", link: "/about" },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCartIcon />;
      case "message":
        return <PersonIcon />;
      case "promotion":
        return <FavoriteIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "order":
        return theme.palette.primary.main;
      case "message":
        return theme.palette.secondary.main;
      case "promotion":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <AppBar
      position="static" // Changed from "fixed" to "static" to make it unfixed
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        color: "#333333",
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", mr: 2 }}
          >
            <img src={logo} alt="c-Store Logo" style={{ height: 40 }} />
          </Box>

          {/* Search Bar */}
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for products, brands, and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          )}

          {/* Category Select */}
          {!isMobile && (
            <FormControl variant="outlined" size="small" sx={{ minWidth: 160, ml: 2 }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                sx={{
                  bgcolor: alpha(theme.palette.grey[200], 1),
                  color: "#333333",
                  "& .MuiSvgIcon-root": { color: "#333333" },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.grey[300], 1),
                  },
                  borderRadius: 1,
                }}
                IconComponent={ExpandMoreIcon}
              >
                <MenuItem value="All Categories">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Icons and Actions */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Notification Icon */}
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleNotificationOpen}>
                  <Badge
                    badgeContent={
                      notifications.filter((notif) => !notif.read).length
                    }
                    color="primary"
                  >
                    <NotificationsIcon sx={{ color: "#333333" }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{ mt: 1, minWidth: 350 }}
              >
                <Box sx={{ px: 2, py: 1, backgroundColor: theme.palette.primary.light }}>
                  <Typography variant="h6" color="#ffffff">Notifications</Typography>
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => {
                          handleNotificationClose();
                          if (!notif.read) handleMarkAsRead(notif.id);
                        }}
                        sx={{
                          backgroundColor: notif.read
                            ? "inherit"
                            : alpha(theme.palette.primary.light, 0.1),
                          alignItems: "flex-start",
                        }}
                      >
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: getNotificationColor(notif.type),
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getNotificationIcon(notif.type)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.primary">
                            {notif.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(notif.time, { addSuffix: true })}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notif.id);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem onClick={handleNotificationClose}>
                      <Typography variant="body2" color="text.secondary">
                        No new notifications
                      </Typography>
                    </MenuItem>
                  )}
                </Box>
                <Divider />
                <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
                  <Link to="/notifications" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary">
                      View All
                    </Typography>
                  </Link>
                </Box>
              </Menu>

              {/* Separate Button: Help */}
              <Tooltip title="Help & Support">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/help"
                  sx={{ ml: 1 }}
                >
                  <HelpOutlineIcon sx={{ color: "#333333" }} />
                </IconButton>
              </Tooltip>

              {/* Authentication Buttons */}
              {isLoggedIn ? (
                <>
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ p: 0, ml: 1 }}
                    >
                      <PersonIcon sx={{ color: "#333333", fontSize: "1.5rem" }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={isProfileMenuOpen}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={handleProfileMenuClose}
                      component={Link}
                      to="/profile"
                    >
                      My Account
                    </MenuItem>
                    <MenuItem
                      onClick={handleProfileMenuClose}
                      component={Link}
                      to="/orders"
                    >
                      Orders
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" href="/signin" sx={{ ml: 1 }}>
                    Login
                  </Button>
                  <Tooltip title="Register">
                    <IconButton
                      color="inherit"
                      component={Link}
                      to="/signup"
                      sx={{
                        ml: 1,
                        bgcolor: "#0071dc",
                        "&:hover": {
                          bgcolor: "#005bb5",
                        },
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#ffffff", px: 1 }}>
                        Register
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* Other Icons */}
              <Tooltip title="Favorites">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/favorites"
                  sx={{ ml: 1 }}
                >
                  <FavoriteIcon sx={{ color: "#333333" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cart">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ ml: 1 }}
                >
                  <ShoppingCartIcon sx={{ color: "#333333" }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon sx={{ color: "#333333" }} />
            </IconButton>
          )}
        </Toolbar>

        {/* Search Bar for Mobile */}
        {isMobile && (
          <Toolbar disableGutters>
            <Search sx={{ width: "100%", ml: 2, mr: 2 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for products, brands, and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Toolbar>
        )}

        {/* Navigation Menu */}
        {!isMobile && (
          <Toolbar
            component="nav"
            variant="dense"
            sx={{
              justifyContent: "center",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f8f8f8", // Changed to a solid color for better visibility
              boxShadow: "0 -1px 5px rgba(0,0,0,0.05)", // Added subtle shadow
            }}
          >
            {navigationLinks.map((item) =>
              item.hasDropdown ? (
                <Box key={item.name} sx={{ position: "relative" }}>
                  <NavButton
                    aria-controls={openNavMenu === item.name ? "nav-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openNavMenu === item.name ? "true" : undefined}
                    onMouseEnter={(e) => handleNavMenuOpen(e, item.name)}
                    onMouseLeave={handleNavMenuClose}
                    sx={{ paddingY: 1, px: 2 }}
                  >
                    {item.name} <ExpandMoreIcon fontSize="small" />
                  </NavButton>
                  <Menu
                    id="nav-menu"
                    anchorEl={navAnchorEl}
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
                  sx={{ paddingY: 1, px: 2 }}
                >
                  {item.name}
                </NavButton>
              )
            )}
          </Toolbar>
        )}
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <DrawerHeader>
            <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="c-Store Logo" style={{ height: 40 }} />
            </Box>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {isLoggedIn ? (
              <>
                <ListItem button component={Link} to="/profile" onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItem>
                <ListItem button component={Link} to="/orders" onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItem>
                <ListItem button component={Link} to="/signup" onClick={toggleDrawer(false)}>
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
            <Divider />
            {navigationLinks.map((item) =>
              item.hasDropdown ? (
                <Box key={item.name}>
                  <ListItem button onClick={(e) => handleNavMenuOpen(e, item.name)}>
                    <ListItemText primary={item.name} />
                    <ExpandMoreIcon />
                  </ListItem>
                  <Menu
                    id={`drawer-nav-menu-${item.name}`}
                    anchorEl={navAnchorEl}
                    open={openNavMenu === item.name}
                    onClose={handleNavMenuClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {item.dropdownItems.map((subItem) => (
                      <MenuItem
                        key={subItem.name}
                        component={Link}
                        to={subItem.link}
                        onClick={() => {
                          handleNavMenuClose();
                          setDrawerOpen(false);
                        }}
                      >
                        {subItem.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <ListItem
                  button
                  component={Link}
                  to={item.link}
                  key={item.name}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to="/notifications" onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
              <Badge badgeContent={notifications.length} color="primary" sx={{ ml: 1 }}>
                {/* Optional: Add a dot or number */}
              </Badge>
            </ListItem>
            <ListItem button component={Link} to="/favorites" onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button component={Link} to="/cart" onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem button component={Link} to="/help" onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Login Dialog */}
      
    </AppBar>
  );
};

export default Header;