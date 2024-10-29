import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function SalesReport() {
    const [filters, setFilters] = useState({
        order_time: '',
        payment_method: '',
        delivery_method: '',
        total_order_price_min: '',
        total_order_price_max: '', 
        order_status: '',
        quantity: ''
    });
    const [sales, setSales] = useState([]);

    const handleFetchReport = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/sales_report', {
                data: filters
            });
            setSales(response.data);
        } catch (err) {
            console.error('Error fetching sales report:', err);
        }
    };

    const handleReset = () => {
        setFilters({
            order_time: '',
            payment_method: '',
            delivery_method: '',
            total_order_price_min: '',
            total_order_price_max: '',
            order_status: '',
            quantity: ''
        });
        setSales([]);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Sales Report</Typography>
            
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Order Time"
                    type="datetime-local"
                    value={filters.order_time}
                    onChange={(e) => setFilters({...filters, order_time: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                    label="Payment Method"
                    value={filters.payment_method}
                    onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
                />

                <TextField
                    label="Delivery Method"
                    value={filters.delivery_method}
                    onChange={(e) => setFilters({...filters, delivery_method: e.target.value})}
                />

                <TextField
                    label="Min Price"
                    type="number"
                    value={filters.total_order_price_min}
                    onChange={(e) => setFilters({...filters, total_order_price_min: e.target.value})}
                />

                <TextField
                    label="Max Price"
                    type="number"
                    value={filters.total_order_price_max}
                    onChange={(e) => setFilters({...filters, total_order_price_max: e.target.value})}
                />

                <TextField
                    label="Order Status"
                    value={filters.order_status}
                    onChange={(e) => setFilters({...filters, order_status: e.target.value})}
                />

                <TextField
                    label="Quantity"
                    type="number"
                    value={filters.quantity}
                    onChange={(e) => setFilters({...filters, quantity: e.target.value})}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleFetchReport}>
                        Get Report
                    </Button>
                    <Button variant="outlined" onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Box>

            {sales.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Time</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Delivery Method</TableCell>
                                <TableCell>Total Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sales.map((sale, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(sale.order_time).toLocaleString()}</TableCell>
                                    <TableCell>{sale.payment_method}</TableCell>
                                    <TableCell>{sale.delivery_method}</TableCell>
                                    <TableCell>${sale.total_order_price}</TableCell>
                                    <TableCell>{sale.order_status}</TableCell>
                                    <TableCell>{sale.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default SalesReport;