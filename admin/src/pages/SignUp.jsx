import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { toast } from 'react-toastify';

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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignUp = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/admin/signup', formData);
      
      toast.success('Registration successful! Please login.');
      navigate('/signin');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <CssBaseline />
      <CardStyled>
        <Typography component="h1" variant="h5" align="center">
          Admin Registration
        </Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              error={Boolean(errors.username)}
              helperText={errors.username}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />
          </FormControl>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </Box>
      </CardStyled>
    </SignUpContainer>
  );
};

export default SignUp;