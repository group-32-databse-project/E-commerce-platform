import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        category_name: '',
        parent_category_id: '',
        category_image: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');
            const response = await axios.get('http://localhost:5001/api/admin/categories');
            console.log('Categories data:', response.data);
            setCategories(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
            setError('Failed to fetch categories');
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            console.log('Sending category data:', formData);

            const response = await axios.post('http://localhost:5001/api/admin/categories', formData);
            if (response.data.status === 200) {
                alert('Category added successfully');
                setOpenDialog(false);
                resetForm();
                fetchCategories();
            } else {
                alert(response.data.error);
            }
        } catch (err) {
            console.error('Error adding category:', err);
            toast.error(err.response?.data?.message || 'Failed to add category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:5001/api/admin/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            toast.error('Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.category_name.trim()) {
            toast.error('Category name is required');
            return false;
        }
        if (!formData.category_image.trim()) {
            toast.error('Image name is required');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            category_name: '',
            parent_category_id: '',
            category_image: ''
        });
    };

    const getParentCategoryName = (parentId) => {
        const parent = categories.find(cat => cat.category_id === parentId);
        return parent ? parent.category_name : 'None';
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Category Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Add Category
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : categories.length === 0 ? (
                    <Alert severity="info">No categories found</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category.category_id}>
                                <Card elevation={2}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`/uploads/${category.category_image}`}
                                        alt={category.category_name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {category.category_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Parent: {getParentCategoryName(category.parent_category_id)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {category.category_id}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDelete(category.category_id)}
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

            {/* Add Category Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => !submitting && setOpenDialog(false)} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.category_name}
                            onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                            disabled={submitting}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Parent Category</InputLabel>
                            <Select
                                value={formData.parent_category_id}
                                label="Parent Category"
                                onChange={(e) => setFormData({...formData, parent_category_id: e.target.value})}
                                disabled={submitting}
                            >
                                <MenuItem value="">None</MenuItem>
                                {categories
                                    .filter(cat => !cat.parent_category_id) // Only show parent categories
                                    .map((cat) => (
                                        <MenuItem 
                                            key={cat.category_id} 
                                            value={cat.category_id}
                                        >
                                            {cat.category_name} (ID: {cat.category_id})
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Image Name"
                            value={formData.category_image}
                            onChange={(e) => setFormData({...formData, category_image: e.target.value})}
                            disabled={submitting}
                            required
                            helperText="Enter the image filename (e.g., category.jpg)"
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
                        {submitting ? <CircularProgress size={24} /> : 'Add Category'}
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

export default Categories;