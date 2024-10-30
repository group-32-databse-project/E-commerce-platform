import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultImage from '../asserts/images/default-image.jpg';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import Dropdown from '../components/ui/Dropdown';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        product_name: '',
        category_id: '',
        product_image: '',
        price: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/products');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Failed to fetch products');
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const response = await axios.post('http://localhost:5001/api/admin/products', formData);
            if (response.data.status === 200) {  
                alert("Product added successfully");
                setOpenDialog(false);
                resetForm();
                fetchProducts();
            } else {
                alert(response.data.error);
            }
        } catch (err) {
            console.error('Error adding product:', err);
            toast.error(err.response?.data?.message || 'Failed to add product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/admin/products/${id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.product_name.trim()) {
            toast.error('Product name is required');
            return false;
        }
        if (!formData.product_image.trim()) {
            toast.error('Image name is required');
            return false;
        }
        if (!formData.price.trim()) {
            toast.error('Price is required');
            return false;
        }
        if (!formData.weight.trim()) {
            toast.error('Weight is required');
            return false;
        }
        if (!formData.rating.trim()) {
            toast.error('Rating is required');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            product_name: '',
            category_id: '',
            product_image: '',
            price: '',
            weight: '',
            rating: ''
        });
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : products.length === 0 ? (
                    <Alert severity="info">No products found</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.product_id}>
                                <Card elevation={2}>
                                    <CardMedia
                                        component="img"
                                        height="140"                                    
                                        image={product.product_image 
                                            ? `/uploads/${product.product_image}` 
                                            : defaultImage
                                        }
                                        alt={product.product_name}
                                        sx={{ objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = defaultImage;
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category ID: {product.category_id}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDelete(product.product_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Add Product Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => !submitting && setOpenDialog(false)} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={formData.product_name}
                            onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                            disabled={submitting}
                            required
                        />
                        <Dropdown
                            label="Category"
                            options={categories.map((cat) => ({
                                label: cat.category_name,
                                value: cat.category_id
                            }))}
                            value={formData.category_id}
                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                            placeholder="Select a category"
                            required
                            sx={{ minWidth: 200 }}
                        />
                        <TextField
                            fullWidth
                            label="Image Name"
                            value={formData.product_image}
                            onChange={(e) => setFormData({...formData, product_image: e.target.value})}
                            disabled={submitting}
                            required
                            helperText="Enter the image filename (e.g., product.jpg)"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            disabled={submitting}
                            required
                            helperText="Enter the product price"
                        />
                        <TextField
                            fullWidth
                            label="Weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            disabled={submitting}
                            required
                            helperText="Enter the product weight"
                        />
                        <TextField
                            fullWidth
                            label="Rating"
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: e.target.value})}
                            disabled={submitting}
                            required
                            helperText="Enter the product rating"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? <CircularProgress size={24} /> : 'Add Product'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Products;
