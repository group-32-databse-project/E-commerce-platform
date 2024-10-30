// import React, { useState } from "react";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Card as MuiCard,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";

// // Styled Components
// const CardStyled = styled(MuiCard)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignSelf: "center",
//   width: "100%",
//   padding: theme.spacing(6),
//   gap: theme.spacing(3),
//   margin: "auto",
//   borderRadius: theme.spacing(2),
//   backgroundColor: theme.palette.background.paper,
//   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//   [theme.breakpoints.up("sm")]: {
//     maxWidth: "450px",
//   },
//   ...(theme.palette.mode === "dark" && {
//     backgroundColor: theme.palette.background.default,
//     boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
//   }),
// }));

// const ForgotPasswordContainer = styled(Stack)(({ theme }) => ({
//   minHeight: "100vh",
//   padding: theme.spacing(2),
//   [theme.breakpoints.up("sm")]: {
//     padding: theme.spacing(4),
//   },
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   position: "relative",
// }));

// const ForgotPassword = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (!email.trim()) {
//       setError("Email is required");
//       return;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Email is invalid");
//       return;
//     }

//     try {
//       // Replace with your actual forgot password API endpoint
//       await axios.post("/api/customers/forgot-password", { email });
//       setMessage("Password reset link has been sent to your email.");
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to send reset link. Please try again.");
//       setMessage("");
//     }
//   };

//   return (
//     <ForgotPasswordContainer>
//       <CardStyled>
//         <Typography component="h1" variant="h5" align="center">
//           Forgot Password
//         </Typography>
//         <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 1 }}>
//           <TextField
//             label="Email Address"
//             variant="outlined"
//             type="email"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             error={Boolean(error)}
//             helperText={error}
//             required
//           />
//           <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
//             Send Reset Link
//           </Button>
//           {message && (
//             <Typography color="success.main" sx={{ mt: 2, textAlign: "center" }}>
//               {message}
//             </Typography>
//           )}
//           <Typography sx={{ textAlign: "center", mt: 2 }}>
//             Remember your password?{" "}
//             <Link component={RouterLink} to="/signin" variant="body2">
//               Sign in
//             </Link>
//           </Typography>
//         </Box>
//       </CardStyled>
//     </ForgotPasswordContainer>
//   );
// };

// export default ForgotPassword;