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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

const SignIn = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState({});

  const handleSignIn = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      console.log("Signing in with email:", email, "and password:", password);
      // Replace with your actual sign-in API endpoint
      const res = await axios.post("http://localhost:5001/api/admin/login", {
        "username": email,
        "password" : password,
      });

      // Assuming the response contains token, name, and customerId
      const { token, name, customerId } = res.data;

      auth.signin(token, name, customerId);
      navigate("/home");
    } catch (err) {
      console.error(err);
      // Handle error (e.g., display error message)
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleBypassLogin = () => {
    // Use the signin method from context to set bypass authentication
    auth.signin("bypass-token", "Bypass User", "bypass-id");
    navigate("/home");
  };

  return (
    <SignInContainer>
      <CssBaseline />
      <CardStyled>
        <Typography component="h1" variant="h5" align="center">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSignIn} sx={{ mt: 1 }}>
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
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link
              component={RouterLink}
              to="/signup"
              variant="body2"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }}>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign in with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
          {/* Bypass Login Button */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleBypassLogin}
            sx={{ marginTop: 2 }}
          >
            Bypass Login
          </Button>
        </Box>
      </CardStyled>
    </SignInContainer>
  );
};

export default SignIn;