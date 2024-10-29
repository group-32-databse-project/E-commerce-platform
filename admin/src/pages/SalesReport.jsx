    import React, { useState } from 'react';
    import axios from 'axios';
    import { Box, Typography, TextField, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

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
        const [revenueData, setRevenueData] = useState([]);

        const handleFetchReport = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/admin/sales_report', {
                    params: filters
                });
                setRevenueData(response.data);
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
            setRevenueData([]);
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
                        sx={{ minWidth: 200 }}
                    />
                    
                    <TextField
                        label="Payment Method"
                        value={filters.payment_method}
                        onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
                        sx={{ minWidth: 150 }}
                    />

                    <TextField
                        label="Delivery Method"
                        value={filters.delivery_method}
                        onChange={(e) => setFilters({...filters, delivery_method: e.target.value})}
                        sx={{ minWidth: 150 }}
                    />

                    <TextField
                        label="Min Price"
                        type="number"
                        value={filters.total_order_price_min}
                        onChange={(e) => setFilters({...filters, total_order_price_min: e.target.value})}
                        sx={{ minWidth: 120 }}
                    />

                    <TextField
                        label="Max Price"
                        type="number"
                        value={filters.total_order_price_max}
                        onChange={(e) => setFilters({...filters, total_order_price_max: e.target.value})}
                        sx={{ minWidth: 120 }}
                    />

                    <TextField
                        label="Order Status"
                        value={filters.order_status}
                        onChange={(e) => setFilters({...filters, order_status: e.target.value})}
                        sx={{ minWidth: 150 }}
                    />

                    <TextField
                        label="Quantity"
                        type="number"
                        value={filters.quantity}
                        onChange={(e) => setFilters({...filters, quantity: e.target.value})}
                        sx={{ minWidth: 120 }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button variant="contained" onClick={handleFetchReport}>
                            Get Report
                        </Button>
                        <Button variant="outlined" onClick={handleReset}>
                            Reset
                        </Button>
                    </Box>
                </Box>

                {revenueData.length > 0 ? (
                    <Box sx={{ 
                        border: '1px solid #ddd', 
                        borderRadius: 2, 
                        p: 2, 
                        mb: 4 
                    }}>
                        <Typography variant="h6" gutterBottom>Revenue by Aircraft Type</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Aircraft</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {revenueData.map((r) => (
                                    <TableRow key={r.model}>
                                        <TableCell>{r.model}</TableCell>
                                        <TableCell>${r.revenue.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box sx={{ 
                            width: '100%', 
                            height: '300px', 
                            marginTop: 2,
                            backgroundColor: '#f8f9fa',
                            padding: 2,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                            gap: 2
                        }}>
                            {revenueData.map((r, index) => {
                                const maxRevenue = Math.max(...revenueData.map(item => item.revenue));
                                const height = (r.revenue / maxRevenue) * 80; // Using 80% of container height
                                return (
                                    <Box key={index} sx={{ 
                                        flex: '1',
                                        maxWidth: '100px',
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Box 
                                            sx={{ 
                                                width: '60%', 
                                                height: `${height}%`, 
                                                backgroundColor: '#4a90e2',
                                                borderRadius: '8px 8px 0 0',
                                                transition: 'height 0.5s ease',
                                                minHeight: '20px'
                                            }} 
                                        />
                                        <Box sx={{ 
                                            mt: 1, 
                                            textAlign: 'center', 
                                            fontSize: '12px',
                                            wordWrap: 'break-word'
                                        }}>
                                            <Typography sx={{ fontWeight: 'bold' }}>{r.model}</Typography>
                                            <Typography>${r.revenue.toLocaleString()}</Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ) : (
                    <Typography>Loading revenue data...</Typography>
                )}
            </Box>
        );
    }
    
    export default SalesReport;