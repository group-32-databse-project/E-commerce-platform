import * as React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useCallback } from "react";
import { fetchPaymentData } from "../services/paymentstypes";
import { styled } from "@mui/material/styles";

import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

// New Imports for Modal
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import PaymentMethodIcon from "@mui/icons-material/Payment"; // Optional: For adding icons

// Example Icons for Payment Methods (Optional)
import PayPalIcon from "@mui/icons-material/AccountBalanceWallet";
import AppleIcon from "@mui/icons-material/Apple";

import { saveCreditCard } from "../services/saveCreditCard";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import FileUpload from "./FileUpload";


// Alert component for Snackbar
const AlertSnackbar = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Card = styled(MuiCard)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.divider,
  width: "100%",
  "&:hover": {
    background:
      "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
    borderColor: "primary.light",
    boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
    ...theme.applyStyles("dark", {
      background:
        "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
      borderColor: "primary.dark",
      boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5) ",
    }),
  },
  [theme.breakpoints.up("md")]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: theme.palette.primary.light,
        ...theme.applyStyles("dark", {
          borderColor: theme.palette.primary.dark,
        }),
      },
    },
  ],
}));

const PaymentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: "1px solid ",
  borderColor: theme.palette.divider,
  background:
    "linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)",
  boxShadow: "0px 4px 8px hsla(210, 0%, 0%, 0.05)",
  [theme.breakpoints.up("xs")]: {
    height: 300,
  },
  [theme.breakpoints.up("sm")]: {
    height: 350,
  },
  ...theme.applyStyles("dark", {
    background:
      "linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)",
    boxShadow: "0px 4px 8px hsl(220, 35%, 0%)",
  }),
}));

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function PaymentForm() {
  const [paymentType, setPaymentType] = React.useState("creditCard");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [expirationDate, setExpirationDate] = React.useState("");
  const [paymentTypes, setPaymentTypes] = React.useState([]); // State for payment types

  // State for Modal
  const [openModal, setOpenModal] = useState(false);
  const [additionalPaymentMethods, setAdditionalPaymentMethods] = useState([]);

  const [saveCard, setSaveCard] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading state

  // States for Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [cardName, setCardName] = useState(""); // New state for card name

  const [cartData, setCartData] = useState({});

  useEffect(() => {
    // Fetch payment data when the component mounts
    const getPaymentTypes = async () => {
      try {
        const data = await fetchPaymentData();
        console.log(data);
        const additionalMethods = data.filter(
          (item) => item.name !== "Credit Card" && item.name !== "Bank Transfer"
        );
        setPaymentTypes(data);
        // Separate main and additional payment methods
        const mainMethods = ["creditCard", "bankTransfer"];
        const additional = data.filter(
          (method) => !mainMethods.includes(method.name)
        );
        setAdditionalPaymentMethods(additional);

        // Set cartData with all values
        setCartData(data);
      } catch (error) {
        console.error("Error fetching payment types:", error);
      }
    };

    getPaymentTypes();
  }, []);

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 16) {
      setCardNumber(formattedValue);
    }
  };

  const handleCvvChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleExpirationDateChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{2})(?=\d{2})/, "$1/");
    if (value.length <= 4) {
      setExpirationDate(formattedValue);
    }
  };

  // Handlers for Modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSelectAdditionalMethod = (method) => {
    // Close the modal
    handleCloseModal();

    // Open a new window for the selected payment method
    const paymentWindow = window.open(
      "",
      `${method.name} Payment`,
      "width=600,height=400"
    );

    if (paymentWindow) {
      paymentWindow.document.write(`
        <html>
          <head>
            <title>${method.name} Payment</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #333;
                margin-bottom: 1rem;
              }
              p {
                color: #666;
                margin-bottom: 2rem;
              }
              button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.3s;
              }
              button:hover {
                background-color: #45a049;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${method.name} Payment</h1>
              <p>This window will be used to implement the ${method.name} payment process.</p>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
    } else {
      // Fallback if pop-up is blocked
      alert(`Please allow pop-ups to use the ${method.name} payment method.`);
    }

    // TODO: Implement actual payment logic in the new window
    console.log(`Selected payment method: ${method.name}`);
  };

  const handleSaveCardChange = (event) => {
    setSaveCard(event.target.checked);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSaveCardData = async () => {
    if (!saveCard) return;

    // Basic validation
    if (!cardName.trim()) {
      setSnackbar({
        open: true,
        message: "Card name is required.",
        severity: "error",
      });
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      setSnackbar({
        open: true,
        message: "A valid 16-digit card number is required.",
        severity: "error",
      });
      return;
    }

    if (!expirationDate || !/^\d{2}\/\d{2}$/.test(expirationDate)) {
      setSnackbar({
        open: true,
        message: "A valid expiration date (MM/YY) is required.",
        severity: "error",
      });
      return;
    }

    if (!cvv || cvv.length !== 3) {
      setSnackbar({
        open: true,
        message: "A valid 3-digit CVV is required.",
        severity: "error",
      });
      return;
    }

    setIsSaving(true); // Start loading

    try {
      const lastFourDigits = cardNumber.replace(/\s/g, "").slice(-4);

      const cardData = {
        lastFourDigits: lastFourDigits,
        cardName: cardName.trim(),
        expirationDate: expirationDate,
        // Only include non-sensitive data
        // Do not include full card number or CVV
      };

      await saveCreditCard(cardData);
      console.log("Card data saved successfully");

      setSnackbar({
        open: true,
        message: "Card data saved successfully.",
        severity: "success",
      });

      // Optionally, reset the form
      setCardNumber("");
      setCvv("");
      setExpirationDate("");
      setCardName("");
      setSaveCard(false);
    } catch (error) {
      console.error("Error saving card data:", error);
      setSnackbar({
        open: true,
        message: `Error saving card data: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  // Handler for form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!cardName.trim()) {
      setSnackbar({
        open: true,
        message: "Card name is required.",
        severity: "error",
      });
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      setSnackbar({
        open: true,
        message: "A valid 16-digit card number is required.",
        severity: "error",
      });
      return;
    }

    if (!expirationDate || !/^\d{2}\/\d{2}$/.test(expirationDate)) {
      setSnackbar({
        open: true,
        message: "A valid expiration date (MM/YY) is required.",
        severity: "error",
      });
      return;
    }

    if (!cvv || cvv.length !== 3) {
      setSnackbar({
        open: true,
        message: "A valid 3-digit CVV is required.",
        severity: "error",
      });
      return;
    }

    setIsSaving(true); // Start loading

    try {
      // TODO: Replace with actual payment processing logic
      const paymentData = {
        card_owner: cardName.trim(),
        card_number: cardNumber.replace(/\s/g, ""),
        expiration_date: expirationDate.replace(/\s/g, ""),
        last_four_digits: cardNumber.replace(/\s/g, "").slice(-4),
      };

      console.log("Submitting payment data:", paymentData);

      // Example: Simulate API call
      await saveCreditCard(paymentData);

      setSnackbar({
        open: true,
        message: "Payment submitted successfully!",
        severity: "success",
      });

      // Optionally, reset the form
      setCardNumber("");
      setCvv("");
      setExpirationDate("");
      setCardName("");
      setSaveCard(false);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setSnackbar({
        open: true,
        message: `Error submitting payment: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Card selected={paymentType === "creditCard"}>
            <CardActionArea
              onClick={() => setPaymentType("creditCard")}
              sx={{
                ".MuiCardActionArea-focusHighlight": {
                  backgroundColor: "transparent",
                },
                "&:focus-visible": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CreditCardRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: "grey.400",
                      ...theme.applyStyles("dark", {
                        color: "grey.600",
                      }),
                    }),
                    paymentType === "creditCard" && {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>Card</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card selected={paymentType === "bankTransfer"}>
            <CardActionArea
              onClick={() => setPaymentType("bankTransfer")}
              sx={{
                ".MuiCardActionArea-focusHighlight": {
                  backgroundColor: "transparent",
                },
                "&:focus-visible": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <AccountBalanceRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: "grey.400",
                      ...theme.applyStyles("dark", {
                        color: "grey.600",
                      }),
                    }),
                    paymentType === "bankTransfer" && {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Bank account
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>

      {/* Conditional Rendering for Payment Types */}
      {paymentType === "creditCard" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <PaymentContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Credit card</Typography>
              <CreditCardRoundedIcon sx={{ color: "text.secondary" }} />
            </Box>
            <SimCardRoundedIcon
              sx={{
                fontSize: { xs: 48, sm: 56 },
                transform: "rotate(90deg)",
                color: "text.secondary",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                gap: 2,
              }}
            >
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-number" required>
                  Card number
                </FormLabel>
                <OutlinedInput
                  id="card-number"
                  autoComplete="card-number"
                  placeholder="0000 0000 0000 0000"
                  required
                  size="small"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </FormGrid>
              <FormGrid sx={{ maxWidth: "20%" }}>
                <FormLabel htmlFor="cvv" required>
                  CVV
                </FormLabel>
                <OutlinedInput
                  id="cvv"
                  autoComplete="CVV"
                  placeholder="123"
                  required
                  size="small"
                  value={cvv}
                  onChange={handleCvvChange}
                />
              </FormGrid>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-name" required>
                  Name
                </FormLabel>
                <OutlinedInput
                  id="card-name"
                  autoComplete="card-name"
                  placeholder="John Smith"
                  required
                  size="small"
                  value={cardName} // Bind to state
                  onChange={(e) => setCardName(e.target.value)} // Update state
                />
              </FormGrid>
              <FormGrid sx={{ flexGrow: 1 }}>
                <FormLabel htmlFor="card-expiration" required>
                  Expiration date
                </FormLabel>
                <OutlinedInput
                  id="card-expiration"
                  autoComplete="card-expiration"
                  placeholder="MM/YY"
                  required
                  size="small"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                />
              </FormGrid>
            </Box>
          </PaymentContainer>
          <FormControlLabel
            control={
              <Checkbox
                name="saveCard"
                checked={saveCard}
                onChange={handleSaveCardChange}
              />
            }
            label="Remember credit card details for next time"
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSaving}
            startIcon={isSaving && <CircularProgress size={20} />}
            sx={{ alignSelf: "flex-end", marginTop: 2 }}
          >
            {isSaving ? "Submitting..." : "Submit Payment"}
          </Button>
        </Box>
      )}
      {paymentType === "bankTransfer" && (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Alert severity="warning" icon={<WarningRoundedIcon />}>
              Your order will be processed once we receive the funds.
            </Alert>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
              Bank account
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please transfer the payment to the bank account details shown
              below.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Bank:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Mastercredit
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Account number:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                123456789
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Routing number:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                987654321
              </Typography>
            </Box>
          </Box>
          <Box>
            <FileUpload />
          </Box>
        </>
      )}

      {/* Consolidated Section for Additional Payment Methods */}
      <Stack spacing={2}>
        <Button
          variant="outlined"
          startIcon={<PaymentMethodIcon />}
          onClick={handleOpenModal}
          fullWidth
          sx={{ justifyContent: "flex-start", padding: 2 }}
        >
          More Payment Options
        </Button>
      </Stack>

      {/* Modal Dialog for Additional Payment Methods */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="additional-payment-methods-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="additional-payment-methods-dialog-title">
          Additional Payment Methods
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {additionalPaymentMethods.length > 0 ? (
              additionalPaymentMethods.map((method) => (
                <Button
                  key={method.payment_method_id}
                  variant="outlined"
                  startIcon={
                    method.icon ? (
                      <img
                        src={method.icon}
                        alt={`${method.name} icon`}
                        style={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <PaymentMethodIcon />
                    )
                  }
                  onClick={() => handleSelectAdditionalMethod(method)}
                  fullWidth
                  sx={{ justifyContent: "flex-start", padding: 2 }}
                >
                  {method.name}
                </Button>
              ))
            ) : (
              <Typography variant="body1">
                No additional payment methods available.
              </Typography>
            )}
          </Stack>

          {/* Example: Additional Instructions or Components */}
          {paymentType === "PayPal" && (
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PayPalIcon />}
                onClick={() => {
                  // Handle PayPal payment flow
                }}
                fullWidth
              >
                Proceed with PayPal
              </Button>
            </Box>
          )}

          {paymentType === "Apple Pay" && (
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AppleIcon />}
                onClick={() => {
                  // Handle Apple Pay payment flow
                }}
                fullWidth
              >
                Proceed with Apple Pay
              </Button>
            </Box>
          )}

          {/* Add more conditional blocks for other payment methods as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Optional: Additional Form Controls */}
      {/* ... */}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <AlertSnackbar
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </AlertSnackbar>
      </Snackbar>
    </Stack>
  );
}
