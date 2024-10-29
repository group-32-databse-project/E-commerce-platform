import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      paper: "#1e1e1e",
      default: "#121212",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 0.2,
        },
      },
    },
  },
});

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: "0 auto",
  height: "70vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const ScrollableContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.common.white, 0.05),
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.common.white, 0.1),
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: alpha(theme.palette.common.white, 0.2),
  },
  padding: "0 !important",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: "all 0.2s ease-in-out",
  borderLeft: "4px solid transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
}));

const AddressSelector = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      name: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      default: true,
      lastUsed: "2024-03-15",
    },
    {
      id: 2,
      type: "office",
      name: "Office",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      default: false,
      lastUsed: "2024-03-10",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState("");

  const initialAddressState = {
    type: "home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    default: false,
    lastUsed: new Date().toISOString().split("T")[0],
  };

  const [newAddress, setNewAddress] = useState(initialAddressState);

  const handleOpenDialog = (address = null) => {
    if (address) {
      setNewAddress(address);
      setEditMode(true);
    } else {
      setNewAddress(initialAddressState);
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewAddress(initialAddressState);
    setFormError("");
    setEditMode(false);
  };

  const validateForm = () => {
    const required = ["name", "street", "city", "state", "zipCode"];
    const missing = required.filter((field) => !newAddress[field]);
    if (missing.length > 0) {
      setFormError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;

    if (editMode) {
      setAddresses(
        addresses.map((addr) => (addr.id === newAddress.id ? newAddress : addr))
      );
    } else {
      const address = {
        ...newAddress,
        id: addresses.length + 1,
      };
      setAddresses([...addresses, address]);
    }
    handleCloseDialog();
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    if (selectedAddress === id) {
      setSelectedAddress(addresses[0]?.id);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <StyledCard elevation={3}>
          <CardHeader
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              p: 2,
            }}
            title={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" component="h1">
                  Delivery Addresses
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  size="small"
                >
                  Add Address
                </Button>
              </Box>
            }
          />
          <ScrollableContent>
            <RadioGroup
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(Number(e.target.value))}
            >
              <List disablePadding>
                {addresses.map((address, index) => (
                  <React.Fragment key={address.id}>
                    {index > 0 && <Divider />}
                    <StyledListItem>
                      <FormControlLabel
                        value={address.id}
                        control={<Radio size="small" sx={{ mr: 1 }} />}
                        label=""
                        sx={{ mr: 1, my: 0 }}
                      />
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {address.type === "home" ? (
                          <HomeIcon color="primary" sx={{ fontSize: 24 }} />
                        ) : (
                          <BusinessIcon color="primary" sx={{ fontSize: 24 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 500 }}
                            >
                              {address.name}
                            </Typography>
                            {address.default && (
                              <Chip
                                label="Default"
                                size="small"
                                color="primary"
                                icon={<CheckIcon sx={{ fontSize: 16 }} />}
                                sx={{ height: 24 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {address.street}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {address.city}, {address.state} {address.zipCode}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit Address">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleOpenDialog(address)}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Address">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteAddress(address.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </StyledListItem>
                  </React.Fragment>
                ))}
              </List>
            </RadioGroup>
          </ScrollableContent>
        </StyledCard>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 2, borderBottom: 1, borderColor: "divider" }}>
            {editMode ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Address Type</InputLabel>
                  <Select
                    value={newAddress.type}
                    label="Address Type"
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, type: e.target.value })
                    }
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="Address Label"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="Street Address"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <StyledTextField
                  fullWidth
                  size="small"
                  label="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zipCode: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ p: 2, pt: 1, borderTop: 1, borderColor: "divider" }}
          >
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAddress}
              color="primary"
            >
              {editMode ? "Update Address" : "Save Address"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AddressSelector;
