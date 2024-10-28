import React, { useState } from 'react';
import axios from 'axios';

function SalesReport() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [quarter, setQuarter] = useState('');
    const [sales, setSales] = useState([]);

    const handleFetchReport = async () => {
        if (!year) return;
        try {
            const params = { year };
            if (quarter) params.quarter = quarter;
            const res = await axios.get('/api/sales-report', { params });
            setSales(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = () => {
        setSales([]);
    };

    return (
        <div>
            <h2>Sales Report</h2>
            <div>
                <label>
                    Year:
                    <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        min="2000" 
                        max="2100"
                    />
                </label>
                <label>
                    Quarter:
                    <select 
                        value={quarter} 
                        onChange={(e) => setQuarter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="1">Q1</option>
                        <option value="2">Q2</option>
                        <option value="3">Q3</option>
                        <option value="4">Q4</option>
                    </select>
                </label>
                <button onClick={handleFetchReport}>Get Report</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            {sales.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Sale Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => (
                            <tr key={sale._id}>
                                <td>{sale.product.name}</td>
                                <td>{sale.quantity}</td>
                                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SalesReport;