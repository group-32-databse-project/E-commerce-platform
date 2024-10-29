import React, { useState,useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { fetchNotifications  } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";





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

const ResultsList = styled('ul')(({ theme }) => ({
  display: 'none',
  backgroundColor: 'white',
  color: '#3b3835',
  border: '1px solid rgba(0,0,0,0.3)',
  borderTop: 0,
  float: 'left',
  left: 0,
  listStyle: 'none',
  margin: 20,
  padding: 8,
  position: 'absolute',
  top: 31,
  width: 180,
  zIndex: 1000,
  WebkitBorderRadius: '4px',
  MozBorderRadius: '4px',
  borderRadius: '4px',
  WebkitBoxShadow: '0 1px 3px rgba(0,0,0,0.25)',
  MozBoxShadow: '0 1px 3px rgba(0,0,0,0.25)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
}));

const ResultItem = styled('li')(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));


const Header = () => {
  const navigate = useNavigate(); 
  const [state, setState] = useState(false);
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
  const [searchResults, setSearchResults] = useState([]);
  const [toyset, setToyset] = useState([]);
  const [elecset, setElecset] = useState([]);
  const [catlist, setCatlist] = useState([]);
  const { authToken } = useAuth();
  
  const [notifications, setNotifications] = useState([]);

  // State for Login Dialog
  
  

  // Handle Login Dialog
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      });
    }
  }, []);


  useEffect(() => {
    console.log("authToken");
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        console.log("data",data);
  setNotifications(data);
      } catch (error) {
        console.log("error",error);
        console.error("Error fetching notifications:", error);
      }
    };
    console.log("end");
  getNotifications();

    // Polling interval (e.g., every 30 seconds)
    const interval = setInterval(() => {
      if (authToken) {
        getNotifications();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
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

  useEffect(() => {
    fetch('/api/category/toys-and-electronics', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setCatlist(data);
        console.log("categories",catlist);
      })
      .catch(error => console.error('Error fetching categories:', error));

    fetch('/api/category/electronics', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setElecset(data);
        console.log("electronics",elecset);
      })
      .catch(error => console.error('Error fetching electronics:', error));

    fetch('/api/category/toys', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setToyset(data);
        console.log("toys",toyset);
      })
      .catch(error => console.error('Error fetching toys:', error));
  }, []);

  const categories = Array.isArray(catlist) ? catlist.map(cat => ({ name: cat.category_name })) : [];

  const navigationLinks = [
    { name: "Home", link: "/" },
    { name: "Saved", link: "/saved" },
    { name: "Deals", link: "/deals" },
    { name: "Contact", link: "/contact" },
    { name: "About", link: "/about" },]
    // ...categories.map((cat) => ({
    //   name: cat.name,

    //   link: `/${cat.category_name}`,
      //hasDropdown: true,
      // dropdownItems: [{...elecset.map((elec) => ({
      //   name: elec.category_name,
      //   link: `/electronics/${elec.category_id}`,
      // }))}
      //   ,{ ...toyset.map((toy) => ({
      //     name: toy.category_name,
      //     link: `/toys/${toy.category_id}`,
      //   }))}
       
      // ]
      

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
      const [toysDropdownOpen, setToysDropdownOpen] = useState(false);
      const [electronicsDropdownOpen, setElectronicsDropdownOpen] = useState(false);
      const renderDropdown = (title, items, isOpen, setIsOpen) => (
        <Box
          sx={{ position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Button>{title}</Button>
          {isOpen && (
        <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: 'white', boxShadow: 3 }}>
          <List>
            {items.map((item) => (
          <ListItem 
            button 
            key={item.name} 
            onClick={() => navigate(`/${item.name}`)}
            sx={{ cursor: 'pointer' }} // Change cursor to pointer
          >
            <ListItemText primary={item.name} />
          </ListItem>
            ))}
          </List>
        </Box>
          )}
        </Box>
      );

      useEffect(() => {
        if (searchQuery.length > 0) {
          // Make a request to the backend when query changes
          console.log("searchQuery", searchQuery);
          fetch(`/api/search?q=${searchQuery}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("data", data);
              setSearchResults(data);
            })
            .catch(error => {
              console.error('Error fetching the search results:', error);
            });
        } else {
          setSearchResults([]); // Clear results if query is empty
        }
      }, [searchQuery]);
    
      console.log("serchresult",searchResults);

      return (
        <AppBar
          position="static" // Changed from "fixed" to "static" to make it unfixed
          sx={{
            backgroundColor: "#B1D6DE",
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
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#A0D6DE',
                      boxShadow: 3,
                      zIndex: 10,
                      borderRadius: 10,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <Grid container spacing={2} sx={{ padding: 2 }}>
                      {searchResults.map((item) => (
                        <Grid item xs={12} key={item.product_id}>
                         <Box
                        sx={{ padding: 1, borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${item.product_name}`)} // Navigate to the corresponding webpage
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
    
                      {!isMobile && (
                      <FormControl variant="outlined" size="small" sx={{ minWidth: 160, ml: 2 }}>
                        <Select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, '-')}`);
                        }}
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
                        notifications.map((notif) => {
                          console.log("Notification Time:", notif.created_at); // 追加
                          return (
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
                                  {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'Unknown time'}
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
                          );
                        })
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
                      to="/api/cart"
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
                  backgroundColor: "#1488DE", // Changed to a solid color for better visibility
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
                        onClick={(e) => handleNavMenuOpen(e, item.name)}
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
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" }, fontFamily: "fantasy", color:"black" }}>
            {renderDropdown('Toys', toyset.map((toy) => ({
              name: toy.category_name,
              link: `/toys/${toy.category_id}`,
            })), toysDropdownOpen, setToysDropdownOpen)}
            {renderDropdown('Electronics', elecset.map((elec) => ({
              name: elec.category_name,
              link: `/electronics/${elec.category_id}`,
            })), electronicsDropdownOpen, setElectronicsDropdownOpen)}
          </Box>        
    
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
