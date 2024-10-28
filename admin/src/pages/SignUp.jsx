import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Styled Components
const CardStyled = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(6),
  gap: theme.spacing(3),
  margin: "auto",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.background.default,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

const SignUp = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleSignUp = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!name.trim()) validationErrors.name = "Name is required";
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid";
    }
    if (!password.trim()) validationErrors.password = "Password is required";
    else if (password.length < 6)
      validationErrors.password = "Password must be at least 6 characters";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      // Replace with your actual sign-up API endpoint
      const res = await axios.post("/api/customers/register", {
        name,
        email,
        password,
      });

      // Assuming the response contains token, name, and customerId
      const { token, name: userName, customerId } = res.data;

      auth.signin(token, userName, customerId);
      navigate("/home");
    } catch (err) {
      console.error(err);
      // Handle error (e.g., display error message)
      alert("Registration failed. Please try again.");
    }
  };

  const handleBypassSignUp = () => {
    // Implement bypass sign-up functionality if needed
    // For example, navigate to home with default user
    auth.signin("bypass-token", "Bypass User", "bypass-id");
    navigate("/home");
  };

  return (
    <SignUpContainer>
      <CssBaseline />
      <CardStyled>
        <Typography component="h1" variant="h5" align="center">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="terms" color="primary" required />}
            label="I agree to the Terms and Conditions"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/signin" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }}>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign up with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign up with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign up with Facebook
          </Button>
          {/* Bypass Sign-Up Button */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleBypassSignUp}
            sx={{ mt: 2 }}
          >
            Bypass Sign-Up
          </Button>
        </Box>
      </CardStyled>
    </SignUpContainer>
  );
};

export default SignUp;