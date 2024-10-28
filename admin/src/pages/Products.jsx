import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Box,
    Rating,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        product_id: '',
        product_name: '',
        category_id: '',
        description: '',
        product_image: '',
        weight: '',
        rating: 0,
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/products');
            console.log('Fetched products:', res.data);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await axios.get('http://localhost:5001/api/admin/categories');
            console.log('Categories data:', response.data);
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
        }
    };

    // Add this to check if categories are loaded
    useEffect(() => {
        console.log('Categories updated:', categories);
    }, [categories]);

    const handleAddProduct = async () => {
        // Validate required fields
        if (!newProduct.product_id || !newProduct.category_id || !newProduct.product_name) {
            toast.error('Product ID, Category and Product Name are required');
            return;
        }

        try {
            setLoading(true);
            console.log('Sending product data:', {
                product_id: parseInt(newProduct.product_id),
                category_id: parseInt(newProduct.category_id),
                product_name: newProduct.product_name,
                description: newProduct.description,
                product_image: newProduct.product_image,
                weight: parseFloat(newProduct.weight),
                rating: parseFloat(newProduct.rating) || 0.0
            });

            const response = await axios.post('/api/admin/products', {
                product_id: parseInt(newProduct.product_id),
                category_id: parseInt(newProduct.category_id),
                product_name: newProduct.product_name,
                description: newProduct.description,
                product_image: newProduct.product_image,
                weight: parseFloat(newProduct.weight),
                rating: parseFloat(newProduct.rating) || 0.0
            });

            console.log('Product added:', response.data);
            toast.success('Product added successfully');
            setOpenDialog(false);
            resetForm();
            fetchProducts(); // Refresh the products list
        } catch (err) {
            console.error('Error adding product:', err);
            toast.error(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = [];
        
        if (!newProduct.product_id) errors.push('Product ID is required');
        if (!newProduct.category_id) errors.push('Category is required');
        if (!newProduct.product_name.trim()) errors.push('Product name is required');
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return false;
        }
        return true;
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            setLoading(true);
            await axios.delete(`/api/admin/products/${productId}`);
            toast.success('Product deleted successfully');
            await fetchProducts();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to delete product';
            console.error('Error deleting product:', err);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNewProduct({
            product_id: '',
            product_name: '',
            category_id: '',
            description: '',
            product_image: '',
            weight: '',
            rating: 0,
        });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.category_name : 'Unknown Category';
    };

    // Helper function to organize categories hierarchically
    const getCategoryLabel = (category) => {
        const parentCategory = categories.find(c => c.category_id === category.parent_category_id);
        if (parentCategory) {
            return `${parentCategory.category_name} > ${category.category_name}`;
        }
        return category.category_name;
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Product Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Add Product
                    </Button>
                </Box>

                {/* Products Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {products.map(product => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`/uploads/${product.product_image}`}
                                        alt={product.product_name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {product.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating value={Number(product.rating)} precision={0.1} readOnly />
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                ({product.rating})
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Weight: {product.weight}kg
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {getCategoryName(product.category_id)}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteProduct(product.product_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Add Product Dialog */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => !loading && setOpenDialog(false)} 
                    maxWidth="sm" 
                    fullWidth
                >
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                type="number"
                                value={newProduct.product_id}
                                onChange={(e) => setNewProduct({...newProduct, product_id: e.target.value})}
                                disabled={loading}
                            />
                            <TextField
                                fullWidth
                                required
                                label="Product Name"
                                value={newProduct.product_name}
                                onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})}
                                disabled={loading}
                            />
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newProduct.category_id || ''}  // Add default empty string
                                    label="Category"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        console.log('Selected category ID:', value);
                                        setNewProduct(prev => ({
                                            ...prev,
                                            category_id: value
                                        }));
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Select a category</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem 
                                            key={category.category_id} 
                                            value={category.category_id}  // Make sure this matches the data type in your state
                                        >
                                            {category.category_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                disabled={loading}
                            />
                            <TextField
                                fullWidth
                                label="Image Name"
                                value={newProduct.product_image}
                                onChange={(e) => setNewProduct({...newProduct, product_image: e.target.value})}
                                disabled={loading}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Weight (kg)"
                                value={newProduct.weight}
                                onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                                inputProps={{ step: "0.1" }}
                                disabled={loading}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography component="legend">Rating</Typography>
                                <Rating
                                    value={Number(newProduct.rating)}
                                    onChange={(_, newValue) => setNewProduct({...newProduct, rating: newValue})}
                                    precision={0.1}
                                    disabled={loading}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddProduct} 
                            variant="contained" 
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Add Product'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default Products;
