import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Grid2 as Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ChevronLeftRounded as ChevronLeftRoundedIcon,
  ChevronRightRounded as ChevronRightRoundedIcon,
} from "@mui/icons-material";

import AddressForm from "../../components/AddressForm";
import PaymentForm from "../../components/PaymentForm";
import Review from "../../components/Review";
import Info from "../../components/Info";
import InfoMobile from "../../components/InfoMobile";
import TemplateFrame from "./TemplateFrame";
import { LogoIcon } from "../sign/CustomIcons";
import getCheckoutTheme from "../../theme/getCheckoutTheme";
import getAddress from "../../api/getAddress";
import AddressValidationErrorDialog from "../../components/AddressValidationErrorDialog";

import { makeOrder } from "../../api/makeOrder";
import { useNavigate } from "react-router-dom";
const steps = ["Shipping Address", "Payment Details", "Review Your Order"];

const renderStepContent = (activeStep) => {
  switch (activeStep) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      return null;
  }
};

const Checkout = () => {
  const [mode, setMode] = useState("light");
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState(null);

  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const address = await getAddress();
      setAddress(address);
      console.log("address", address);
      if (address) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setErrorMessage("Please enter a valid address");
        setOpenErrorDialog(true);
      }
    } else if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // const payment = await getPayment();
      // console.log("payment", payment);
    } else if (activeStep === steps.length - 1) {
      const orderId = await makeOrder();

      navigate(`/orderConfirmation/${orderId}`);
    }
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleTryAgain = () => {
    setOpenErrorDialog(false);
    // Add any additional logic here before retrying
    handleNext();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const totalPrice = activeStep >= 2 ? "$144.97" : "$134.98";

  // Add this useEffect to log activeStep changes
  useEffect(() => {
    console.log("Active step changed:", activeStep);
  }, [activeStep]);

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
          {/* Sidebar */}
          {activeStep !== steps.length && (
            <Grid
              size={{ xs: 12, sm: 5, lg: 4 }}
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                backgroundColor: "background.paper",
                borderRight: { sm: "none", md: "1px solid" },
                borderColor: { sm: "none", md: "divider" },
                alignItems: "start",
                pt: 16,
                px: 10,
                gap: 4,
              }}
            >
              <LogoIcon />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  width: "100%",
                  maxWidth: 500,
                }}
              >
                <Info totalPrice={totalPrice} />
              </Box>
            </Grid>
          )}

          {/* Main Content */}
          {activeStep !== steps.length && (
            <Grid
              size={{ sm: 12, md: 7, lg: 8 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
                width: "100%",
                backgroundColor: {
                  xs: "transparent",
                  sm: "background.default",
                },
                alignItems: "start",
                pt: { xs: 6, sm: 16 },
                px: { xs: 2, sm: 10 },
                gap: { xs: 4, md: 8 },
              }}
            >
              {/* Stepper Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { sm: "space-between", md: "flex-end" },
                  alignItems: "center",
                  width: "100%",
                  maxWidth: { sm: "100%", md: 600 },
                }}
              >
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    flexGrow: 1,
                  }}
                >
                  <Stepper
                    activeStep={activeStep}
                    sx={{ width: "100%", height: 40 }}
                  >
                    {steps.map((label) => (
                      <Step
                        key={label}
                        sx={{
                          ":first-child": { pl: 0 },
                          ":last-child": { pr: 0 },
                        }}
                      >
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Box>

              {/* Mobile Info Card */}
              <Card sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Products
                    </Typography>
                    <Typography variant="body1">{totalPrice}</Typography>
                  </Box>
                  <InfoMobile totalPrice={totalPrice} />
                </CardContent>
              </Card>

              {/* Stepper and Content */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  width: "100%",
                  maxWidth: { sm: "100%", md: 600 },
                  maxHeight: "720px",
                  gap: { xs: 5, md: "none" },
                }}
              >
                {/* Mobile Stepper */}
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ display: { sm: "flex", md: "none" } }}
                >
                  {steps.map((label) => (
                    <Step
                      key={label}
                      sx={{
                        ":first-child": { pl: 0 },
                        ":last-child": { pr: 0 },
                        "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                      }}
                    >
                      <StepLabel
                        sx={{
                          ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Step Content */}
                {activeStep === steps.length ? (
                  <>
                    <Stack spacing={2} useFlexGap>
                      <Typography variant="h1">📦</Typography>
                      <Typography variant="h5">
                        Thank You for Your Order!
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        Your order number is <strong>#140396</strong>. We have
                        emailed your order confirmation and will update you once
                        it's shipped.
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          alignSelf: "start",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        Go to My Orders
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Fragment>
                    {renderStepContent(activeStep)}
                    <Box
                      sx={[
                        {
                          display: "flex",
                          flexDirection: { xs: "column-reverse", sm: "row" },
                          alignItems: "end",
                          flexGrow: 1,
                          gap: 1,
                          pb: { xs: 12, sm: 0 },
                          mt: { xs: 2, sm: 0 },
                          mb: "60px",
                        },
                        activeStep !== 0
                          ? { justifyContent: "space-between" }
                          : { justifyContent: "flex-end" },
                      ]}
                    >
                      {activeStep !== 0 && (
                        <>
                          <Button
                            startIcon={<ChevronLeftRoundedIcon />}
                            onClick={handleBack}
                            variant="text"
                            sx={{ display: { xs: "none", sm: "flex" } }}
                          >
                            Previous
                          </Button>
                          <Button
                            startIcon={<ChevronLeftRoundedIcon />}
                            onClick={handleBack}
                            variant="outlined"
                            fullWidth
                            sx={{ display: { xs: "flex", sm: "none" } }}
                          >
                            Previous
                          </Button>
                        </>
                      )}
                      <Button
                        variant="contained"
                        endIcon={<ChevronRightRoundedIcon />}
                        onClick={handleNext}
                        sx={{ width: { xs: "100%", sm: "fit-content" } }}
                      >
                        {activeStep === steps.length - 1
                          ? "Place Order"
                          : "Next"}
                      </Button>
                    </Box>
                  </Fragment>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </ThemeProvider>
    </TemplateFrame>
  );
};

export default Checkout;
