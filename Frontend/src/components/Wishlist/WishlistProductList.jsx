// // Frontend/src/components/WishlistProductList.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Card,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Modal,
//   CircularProgress,
//   Chip,
//   CardMedia,
//   CardContent,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {  
//   FavoriteBorder, 
//   Favorite, 
//   ShoppingCart as ShoppingCartIcon, 
//   Visibility as VisibilityIcon, 
//   Star as StarIcon 
// } from "@mui/icons-material";
// import { addToWishlist, removeFromWishlist, getWishlist } from "../../services/wishlist";
// import { useNavigate } from "react-router-dom";

// // Styled Components
// const WishlistButton = styled(IconButton)(({ theme }) => ({
//   position: "absolute",
//   top: theme.spacing(2),
//   right: theme.spacing(2),
//   backgroundColor: "rgba(255, 255, 255, 0.9)",
//   zIndex: 3,
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 1)",
//   },
// }));

// const QuickViewButton = styled(IconButton)(({ theme }) => ({
//   position: "absolute",
//   top: theme.spacing(2),
//   right: theme.spacing(10),
//   backgroundColor: "rgba(255, 255, 255, 0.9)",
//   zIndex: 3,
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 1)",
//   },
// }));

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "95%",
//   maxWidth: 900,
//   bgcolor: "background.paper",
//   borderRadius: 4,
//   boxShadow: 24,
//   p: 5,
// };

// const ImageCarousel = styled("div")(({ theme }) => ({
//   position: "relative",
//   width: "100%",
//   height: "450px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   overflow: "hidden",
//   borderRadius: theme.spacing(1),
// }));

// const WishlistProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         setProducts(data || []); // Ensure 'data' is always an array
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]); // Fallback to an empty array
//       }
//     };

//     const fetchWishlist = async () => {
//       try {
//         const wishlistData = await getWishlist();
//         setWishlist(wishlistData || []); // Ensure 'wishlistData' is an array
//       } catch (error) {
//         console.error("Error fetching wishlist:", error);
//         setWishlist([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//     fetchWishlist();
//   }, []);

//   const handleWishlistToggle = async (productId) => {
//     const isInWishlist = wishlist.some(item => item.product_id === productId);
//     try {
//       if (isInWishlist) {
//         await removeFromWishlist(productId);
//         setWishlist(prev => prev.filter(item => item.product_id !== productId));
//       } else {
//         await addToWishlist(productId);
//         setWishlist(prev => [...prev, { product_id: productId }]);
//       }
//     } catch (error) {
//       console.error("Error toggling wishlist:", error);
//     }
//   };

//   const handleOpenModal = (product) => {
//     setSelectedProduct(product);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedProduct(null);
//     setOpenModal(false);
//   };

//   const handleAddToCart = (product) => {
//     console.log(`Add to Cart clicked for product ID: ${product.product_id}`);
//   };

//   const handleProceedToProduct = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   const renderProductCard = (product, isInWishlist) => (
//     <Grid key={product.product_id} item xs={12} sm={6} md={4} display="flex" justifyContent="center">
//       <Card sx={{ position: "relative", width: "100%", maxWidth: 345 }}>
//         <WishlistButton onClick={() => handleWishlistToggle(product.product_id)}>
//           {isInWishlist ? <Favorite color="secondary" /> : <FavoriteBorder />}
//         </WishlistButton>

//         <QuickViewButton onClick={() => handleOpenModal(product)}>
//           <VisibilityIcon />
//         </QuickViewButton>

//         <CardMedia
//           component="img"
//           height="200"
//           image={product.product_image}
//           alt={product.product_name}
//           onClick={() => handleProceedToProduct(product.product_id)}
//           sx={{ cursor: "pointer" }}
//         />

//         <CardContent>
//           <Typography
//             gutterBottom
//             variant="h5"
//             component="div"
//             onClick={() => handleProceedToProduct(product.product_id)}
//             sx={{ cursor: "pointer" }}
//           >
//             {product.product_name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             ${product.price}
//           </Typography>
//           <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
//             { (product.tags || []).map((tag, index) => (
//               <Chip key={index} label={tag} variant="outlined" />
//             )) }
//           </Box>
//         </CardContent>

//         <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<ShoppingCartIcon />}
//             onClick={() => handleAddToCart(product)}
//           >
//             Add to Cart
//           </Button>
//           <Button
//             variant="outlined"
//             color="success"
//             endIcon={<StarIcon />}
//             onClick={() => handleProceedToProduct(product.product_id)}
//           >
//             Buy Now
//           </Button>
//         </Box>
//       </Card>
//     </Grid>
//   );

//   const wishlistProducts = products.filter(product => 
//     wishlist.some(item => item.product_id === product.product_id)
//   );
//   const recommendedProducts = products.filter(product => 
//     !wishlist.some(item => item.product_id === product.product_id)
//   );

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Your Wishlist
//       </Typography>
//       <Grid container spacing={4}>
//         {wishlistProducts.map(product => renderProductCard(product, true))}
//       </Grid>

//       {wishlistProducts.length === 0 && (
//         <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
//           Your wishlist is empty. Check out our recommendations below!
//         </Typography>
//       )}

//       <Typography variant="h4" sx={{ mt: 6, mb: 2 }}>
//         Recommended Products
//       </Typography>
//       <Grid container spacing={4}>
//         {recommendedProducts.map(product => renderProductCard(product, false))}
//       </Grid>

//       {selectedProduct && (
//         <Modal open={openModal} onClose={handleCloseModal}>
//           <Box sx={modalStyle}>
//             <Typography variant="h4" gutterBottom>
//               {selectedProduct.product_name}
//             </Typography>
//             <ImageCarousel>
//               <img src={selectedProduct.product_image} alt={selectedProduct.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//             </ImageCarousel>
//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Price: ${selectedProduct.price}
//             </Typography>
//             <Box sx={{ mt: 2 }}>
//               { (selectedProduct.tags || []).map((tag, index) => (
//                 <Chip key={index} label={tag} variant="outlined" sx={{ mr: 1, mb: 1 }} />
//               )) }
//             </Box>
//             <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<ShoppingCartIcon />}
//                 onClick={() => {
//                   handleAddToCart(selectedProduct);
//                   handleCloseModal();
//                 }}
//               >
//                 Add to Cart
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="success"
//                 endIcon={<StarIcon />}
//                 onClick={() => {
//                   handleProceedToProduct(selectedProduct.product_id);
//                   handleCloseModal();
//                 }}
//               >
//                 Buy Now
//               </Button>
//             </Box>
//           </Box>
//         </Modal>
//       )}
//     </Box>
//   );
// };

// export default WishlistProductList;
