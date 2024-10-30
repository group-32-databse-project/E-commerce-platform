import React, { useState , useEffect} from 'react';
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
import { BarChart } from '../components/ui/chart';

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
    } catch (err) {
      console.error('Error fetching sales report:', err);
      alert('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      order_time: 'Monthly',
      payment_method: 'All',
      delivery_method: 'All',
      total_order_price_min: '',
      total_order_price_max: '',
      order_status: 'All',
      quantity: '',
    });
    setRevenueData([]);
    handleFetchReport();
  };
  useEffect(() => {
    handleFetchReport();
  }, []);

  const chartConfigs = [
    {
      title: 'Average Total Price',
      valueKey: 'avg_total_price',
      color: '#4a90e2',
      prefix: '$'
    },
    {
      title: 'Average Subtotal',
      valueKey: 'avg_subtotal',
      color: '#82ca9d',
      prefix: '$'
    },
    {
      title: 'Average Shipping',
      valueKey: 'avg_shipping',
      color: '#ffc658',
      prefix: '$'
    },
    {
      title: 'Average Tax',
      valueKey: 'avg_tax',
      color: '#ff7f50',
      prefix: '$'
    },
    {
      title: 'Average Quantity',
      valueKey: 'avg_quantity',
      color: '#8884d8'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: "#ffffff" }}>
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
                      Min Total Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Average Total Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: "#1f2a40" }}>
                      Max Total Price
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
                      <TableCell>${parseFloat(r.min_total_price).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_total_price).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.max_total_price).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_subtotal).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_shipping).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(r.avg_tax).toFixed(2)}</TableCell>
                      <TableCell>{parseFloat(r.avg_quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 4 }}>
              {chartConfigs.map((config, index) => (
                <BarChart
                  key={index}
                  data={revenueData.data}
                  {...config}
                />
              ))}
            </Box>
          </>
        ) : (
          <Alert severity="info">
            No revenue data available. Please apply filters to retrieve data.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default SalesReport;