import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/Warning";
import { keyframes } from "@emotion/react";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, 0 0 20px #ff00ff; }
  50% { box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; }
  100% { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff, 0 0 20px #ff00ff; }
`;

const errorMessages = [
  "Invalid street address format",
  "City name not recognized",
  "Postal code does not match the provided state",
  "Unable to verify address with external service",
];

const AddressValidationErrorDialog = ({ open, onClose, onTryAgain }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      PaperProps={{
        style: {
          borderRadius: 20,
          background: "linear-gradient(45deg, #000000, #1a1a1a)",
          border: "2px solid #ff00ff",
          animation: `${glowAnimation} 2s infinite`,
        },
      }}
    >
      <DialogTitle
        id="error-dialog-title"
        sx={{
          color: "#ff00ff",
          py: 3,
          textAlign: "center",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <ErrorOutlineIcon
            fontSize="large"
            sx={{
              mr: 2,
              animation: `${pulseAnimation} 1.5s infinite`,
              color: "#ff00ff",
            }}
          />
          <Typography variant="h4" component="span" fontWeight="bold">
            Address Error!
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          color="#00ffff"
          paragraph
          textAlign="center"
        >
          Critical issues detected:
        </Typography>
        <List
          sx={{
            bgcolor: "rgba(255, 0, 255, 0.1)",
            borderRadius: 4,
            py: 1,
            border: "1px solid #00ffff",
          }}
        >
          {errorMessages.map((message, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon>
                <WarningIcon sx={{ color: "#ffff00" }} />
              </ListItemIcon>
              <ListItemText
                primary={message}
                primaryTypographyProps={{
                  color: "#ffffff",
                  fontWeight: "medium",
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 4,
            px: 3,
            color: "#00ffff",
            borderColor: "#00ffff",
            "&:hover": {
              backgroundColor: "rgba(0, 255, 255, 0.1)",
            },
          }}
        >
          Abort
        </Button>
        <Button
          onClick={onTryAgain}
          variant="contained"
          size="large"
          autoFocus
          sx={{
            borderRadius: 4,
            px: 3,
            backgroundColor: "#ff00ff",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#ff66ff",
            },
          }}
        >
          Retry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressValidationErrorDialog;
