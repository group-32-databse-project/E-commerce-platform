import React, { useState, useEffect, useCallback, memo } from "react";
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
  Grid,
} from "@mui/material";
import { styled, alpha, useTheme, keyframes } from "@mui/material/styles";
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
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { formatDistanceToNow } from "date-fns";
import { fetchNotifications } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";
import { getWishlist } from "../services/wishlist";
import { debounce } from "lodash";

// Styled Components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  width: "100%",
  transition: theme.transitions.create("background-color"),
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
  color: theme.palette.text.primary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
  transition: theme.transitions.create("color"),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  justifyContent: "space-between",
  ...theme.mixins.toolbar,
}));

const Animation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedMenu = styled(Menu)(({ theme }) => ({
  animation: `${Animation} 0.3s ease-out`,
}));

// Memoized Notification Item
const NotificationItem = memo(({ notif, handleMarkAsRead, handleDelete }) => {
  const theme = useTheme();

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
    <MenuItem
      onClick={() => {
        handleMarkAsRead(notif.id);
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
          {notif.time
            ? formatDistanceToNow(new Date(notif.time), {
                addSuffix: true,
              })
            : "Unknown time"}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(notif.id);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </MenuItem>
  );
});

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [navAnchorEl, setNavAnchorEl] = useState(null);
  const [openNavMenu, setOpenNavMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [toyset, setToyset] = useState([]);
  const [elecset, setElecset] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  const { authToken } = useAuth();

  // Debounced Search Function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.length === 0) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await fetch(`/api/search?q=${query}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return debouncedSearch.cancel;
  }, [searchQuery, debouncedSearch]);

  // Verify Authentication Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        })
        .catch((error) => {
          console.error("Token verification error:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        });
    }
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Notification fetch error:", error);
      }
    };

    if (authToken) {
      getNotifications();
      const interval = setInterval(getNotifications, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [authToken]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
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
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [toys, electronics] = await Promise.all([
          fetch("/api/category/toys").then((res) => res.json()),
          fetch("/api/category/electronics").then((res) => res.json()),
        ]);
        setToyset(toys);
        setElecset(electronics);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Wishlist Count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const wishlist = await getWishlist();
        setWishlistCount(wishlist.length);
      } catch (error) {
        console.error("Wishlist fetch error:", error);
      }
    };
    fetchWishlistCount();
  }, []);

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Saved", link: "/saved" },
    { name: "Deals", link: "/deals" },
    { name: "Contact", link: "/contact" },
    { name: "About", link: "/about" },
    {
      name: "Toys",
      link: "/toys",
      hasDropdown: true,
      dropdownItems: toyset.map((toy) => ({
        name: toy.category_name,
        link: `/category/${toy.category_id}`,
      })),
    },
    {
      name: "Electronics",
      link: "/electronics",
      hasDropdown: true,
      dropdownItems: elecset.map((elec) => ({
        name: elec.category_name,
        link: `/category/${elec.category_id}`,
      })),
    },
  ];

  const unreadNotifications = notifications.filter(
    (notif) => !notif.read
  ).length;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        color: theme.palette.text.primary,
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
            <img src={logo} alt="Company Logo" style={{ height: 50 }} />
          </Box>

          {/* Search Bar */}
          {!isMobile && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products, brands..."
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[5],
                    zIndex: 10,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <Grid container spacing={2} sx={{ padding: 2 }}>
                    {searchResults.map((item) => (
                      <Grid item xs={12} key={item.product_id}>
                        <Box
                          sx={{
                            padding: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                          onClick={() =>
                            navigate(`/product/${item.product_id}`)
                          }
                        >
                          {item.product_name}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Search>
          )}

          {/* Category Select */}
          {!isMobile && (
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 160, ml: 2 }}
            >
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  navigate(
                    `/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`
                  );
                }}
                displayEmpty
                sx={{
                  bgcolor: alpha(theme.palette.grey[100], 1),
                  color: theme.palette.text.primary,
                  "& .MuiSvgIcon-root": { color: theme.palette.text.primary },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.grey[200], 1),
                  },
                  borderRadius: 1,
                }}
                IconComponent={ExpandMoreIcon}
                inputProps={{ "aria-label": "Select category" }}
              >
                <MenuItem value="All Categories">All Categories</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Icons and Actions */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotificationOpen}
                  aria-label="show notifications"
                >
                  <Badge badgeContent={unreadNotifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <AnimatedMenu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  <Typography variant="h6" color="common.white">
                    Notifications
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notif={notif}
                        handleMarkAsRead={handleMarkAsRead}
                        handleDelete={handleDeleteNotification}
                      />
                    ))
                  ) : (
                    <MenuItem>
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
              </AnimatedMenu>

              {/* Help */}
              <Tooltip title="Help & Support">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/help"
                  aria-label="help and support"
                  sx={{ ml: 1 }}
                >
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>

              {/* Authentication */}
              {isLoggedIn ? (
                <>
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ p: 0, ml: 1 }}
                      aria-label="account of current user"
                      aria-controls="profile-menu"
                      aria-haspopup="true"
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
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
                  <Button
                    color="inherit"
                    component={Link}
                    to="/signin"
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                  <Tooltip title="Register">
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/signup"
                      sx={{
                        ml: 1,
                        bgcolor: theme.palette.primary.dark,
                        "&:hover": {
                          bgcolor: theme.palette.primary.main,
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Tooltip>
                </>
              )}

              {/* Cart */}
              <Tooltip title="Cart">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  aria-label="cart"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={wishlistCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Wishlist */}
              <Tooltip title="Wishlist">
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/wishlist"
                  aria-label="wishlist"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={wishlistCount} color="secondary">
                    <FavoriteIcon />
                  </Badge>
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
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && (
          <Toolbar disableGutters>
            <Search sx={{ width: "100%", ml: 2, mr: 2 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products, brands..."
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
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
            }}
          >
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
                      openNavMenu === item.name ? "nav-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={
                      openNavMenu === item.name ? "true" : undefined
                    }
                    sx={{ paddingY: 1, px: 2 }}
                  >
                    {item.name} <ExpandMoreIcon fontSize="small" />
                  </NavButton>
                  <AnimatedMenu
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
                  </AnimatedMenu>
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
            <Box
              component={Link}
              to="/"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img src={logo} alt="Company Logo" style={{ height: 40 }} />
            </Box>
            <IconButton onClick={toggleDrawer(false)} aria-label="close drawer">
              <CloseIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {isLoggedIn ? (
              <>
                <ListItem
                  button
                  component={Link}
                  to="/profile"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/orders"
                  onClick={toggleDrawer(false)}
                >
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
                <ListItem
                  button
                  component={Link}
                  to="/signin"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign In" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/signup"
                  onClick={toggleDrawer(false)}
                >
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
            <Divider />
          </List>
          <List>
            <ListItem
              button
              component={Link}
              to="/notifications"
              onClick={toggleDrawer(false)}
            >
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
              <Badge
                badgeContent={notifications.length}
                color="secondary"
                sx={{ ml: 1 }}
              >
                {/* Badge Element */}
              </Badge>
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/cart"
              onClick={toggleDrawer(false)}
            >
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/help"
              onClick={toggleDrawer(false)}
            >
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
            {/* Toys Categories */}
            <ListItem button>
              <ListItemText primary="Toys" />
            </ListItem>
            {toyset.map((toy) => (
              <ListItem
                key={toy.category_id}
                button
                component={Link}
                to={`/category/${toy.category_id}`}
                sx={{ pl: 4 }}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={toy.category_name} />
              </ListItem>
            ))}
            {/* Electronics Categories */}
            <ListItem button>
              <ListItemText primary="Electronics" />
            </ListItem>
            {elecset.map((elec) => (
              <ListItem
                key={elec.category_id}
                button
                component={Link}
                to={`/category/${elec.category_id}`}
                sx={{ pl: 4 }}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={elec.category_name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default memo(Header);
