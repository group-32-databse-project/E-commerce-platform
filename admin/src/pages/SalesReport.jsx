import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from '@mui/material';

function SalesReport() {
  const [filters, setFilters] = useState({
    order_time: 'Monthly',
    payment_method: 'All',
    delivery_method: 'All',
    total_order_price_min: '',
    total_order_price_max: '',
    order_status: 'All',
    quantity: '',
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/admin/sales_report', filters);
      setRevenueData(response.data);
      alert('Sales report fetched successfully');
      alert(response.data);
    } catch (err) {
      console.error('Error fetching sales report:', err);
      alert('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      order_time: '',
      payment_method: 'All',
      delivery_method: 'All',
      total_order_price_min: '',
      total_order_price_max: '',
      order_status: 'All',
      quantity: '',
    });
    setRevenueData([]);
  };

  useEffect(() => {
    // Optionally fetch initial data
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" gutterBottom color="#1f2a40">
          Sales Report
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            select
            label="Order Time"
            value={filters.order_time}
            onChange={(e) =>
              setFilters({ ...filters, order_time: e.target.value })
            }
            sx={{ minWidth: 200 }}
          >
            
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quartly">Quartly</MenuItem>
            <MenuItem value="Half Year">Half Year</MenuItem>
            <MenuItem value="Annual">Annual</MenuItem>
          </TextField>

          <TextField
            select
            label="Payment Method"
            value={filters.payment_method}
            onChange={(e) =>
              setFilters({ ...filters, payment_method: e.target.value })
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Debit Card">Debit Card</MenuItem>
            <MenuItem value="PayPal">PayPal</MenuItem>
            <MenuItem value="Apple Pay">Apple Pay</MenuItem>
            <MenuItem value="Google Pay">Google Pay</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cash on Delivery">Cash on Delivery</MenuItem>
            <MenuItem value="Gift Card">Gift Card</MenuItem>
            <MenuItem value="Cryptocurrency">Cryptocurrency</MenuItem>
            <MenuItem value="Afterpay">Afterpay</MenuItem>
          </TextField>

          <TextField
            select
            label="Delivery Method"
            value={filters.delivery_method}
            onChange={(e) =>
              setFilters({ ...filters, delivery_method: e.target.value })
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="express">Express</MenuItem>
            <MenuItem value="overnight">Overnight</MenuItem>
          </TextField>

          <TextField
            label="Min Price"
            type="number"
            value={filters.total_order_price_min}
            onChange={(e) =>
              setFilters({ ...filters, total_order_price_min: e.target.value })
            }
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Max Price"
            type="number"
            value={filters.total_order_price_max}
            onChange={(e) =>
              setFilters({ ...filters, total_order_price_max: e.target.value })
            }
            sx={{ minWidth: 120 }}
          />

          <TextField
            select
            label="Order Status"
            value={filters.order_status}
            onChange={(e) =>
              setFilters({ ...filters, order_status: e.target.value })
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={filters.quantity}
            onChange={(e) =>
              setFilters({ ...filters, quantity: e.target.value })
            }
            sx={{ minWidth: 120 }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleFetchReport}
              sx={{
                backgroundColor: "#4a90e2",
                '&:hover': {
                  backgroundColor: "#407ec9",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Report'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                color: "#1f2a40",
                borderColor: "#1f2a40",
                '&:hover': {
                  borderColor: "#4a90e2",
                  color: "#4a90e2",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : revenueData.data && revenueData.data.length > 0 ? (
          <>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 2,
                mb: 4,
                backgroundColor: "#f9fafb",
              }}
            >
              <Typography variant="h6" gutterBottom color="#1f2a40">
                Monthly Sales Report
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Month
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Total Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Subtotal
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Shipping
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Tax
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.data.map((r) => (
                    <TableRow key={r.report_month}>
                      <TableCell>{r.report_month}</TableCell>
                      <TableCell>${parseFloat(r.avg_total_price).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_subtotal).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_shipping).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_tax).toFixed(2)}</TableCell>
                      <TableCell>{parseFloat(r.avg_quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Average Total Price Chart */}
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    marginTop: 2,
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ position: 'absolute', ml: 2, mt: -4 }}>Average Total Price</Typography>
                  {revenueData.data.map((r, index) => {
                    const maxTotal = Math.max(
                      ...revenueData.data.map((item) => parseFloat(item.avg_total_price))
                    );
                    const height = (parseFloat(r.avg_total_price) / maxTotal) * 100 * 2;
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: '1',
                          maxWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '60%',
                            height: `${height}px`,
                            backgroundColor: '#4a90e2',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '20px',
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '12px',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                            {r.report_month}
                          </Typography>
                          <Typography color="#555555">
                            ${parseFloat(r.avg_total_price).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Average Subtotal Chart */}
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ position: 'absolute', ml: 2, mt: -4 }}>Average Subtotal</Typography>
                  {revenueData.data.map((r, index) => {
                    const maxSubtotal = Math.max(
                      ...revenueData.data.map((item) => parseFloat(item.avg_subtotal))
                    );
                    const height = (parseFloat(r.avg_subtotal) / maxSubtotal) * 100 * 2;
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: '1',
                          maxWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '60%',
                            height: `${height}px`,
                            backgroundColor: '#82ca9d',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '20px',
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '12px',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                            {r.report_month}
                          </Typography>
                          <Typography color="#555555">
                            ${parseFloat(r.avg_subtotal).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Average Shipping Chart */}
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ position: 'absolute', ml: 2, mt: -4 }}>Average Shipping</Typography>
                  {revenueData.data.map((r, index) => {
                    const maxShipping = Math.max(
                      ...revenueData.data.map((item) => parseFloat(item.avg_shipping))
                    );
                    const height = (parseFloat(r.avg_shipping) / maxShipping) * 100 * 2;
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: '1',
                          maxWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '60%',
                            height: `${height}px`,
                            backgroundColor: '#ffc658',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '20px',
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '12px',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                            {r.report_month}
                          </Typography>
                          <Typography color="#555555">
                            ${parseFloat(r.avg_shipping).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Average Tax Chart */}
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ position: 'absolute', ml: 2, mt: -4 }}>Average Tax</Typography>
                  {revenueData.data.map((r, index) => {
                    const maxTax = Math.max(
                      ...revenueData.data.map((item) => parseFloat(item.avg_tax))
                    );
                    const height = (parseFloat(r.avg_tax) / maxTax) * 100 * 2;
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: '1',
                          maxWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '60%',
                            height: `${height}px`,
                            backgroundColor: '#ff7f50',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '20px',
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '12px',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                            {r.report_month}
                          </Typography>
                          <Typography color="#555555">
                            ${parseFloat(r.avg_tax).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Average Quantity Chart */}
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f8f9fa',
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ position: 'absolute', ml: 2, mt: -4 }}>Average Quantity</Typography>
                  {revenueData.data.map((r, index) => {
                    const maxQuantity = Math.max(
                      ...revenueData.data.map((item) => parseFloat(item.avg_quantity))
                    );
                    const height = (parseFloat(r.avg_quantity) / maxQuantity) * 100 * 2;
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: '1',
                          maxWidth: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '60%',
                            height: `${height}px`,
                            backgroundColor: '#8884d8',
                            borderRadius: '8px 8px 0 0',
                            minHeight: '20px',
                          }}
                        />
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '12px',
                            wordWrap: 'break-word',
                          }}
                        >
                          <Typography sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                            {r.report_month}
                          </Typography>
                          <Typography color="#555555">
                            {parseFloat(r.avg_quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Alert severity="info">No revenue data available. Please apply filters to retrieve data.</Alert>
        )}
      </Paper>
    </Box>
  );
}

export default SalesReport;