import React from 'react';
import { Box, Typography } from '@mui/material';

export const BarChart = ({ 
  data, 
  valueKey, 
  title, 
  color, 
  formatValue = (value) => value.toFixed(2),
  prefix = ''
}) => {
  const maxValue = Math.max(...data.map(item => parseFloat(item[valueKey])));
  
  return (
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
        position: 'relative'
      }}
    >
      {data.map((item, index) => {
        const height = (parseFloat(item[valueKey]) / maxValue) * 100 * 2;
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
                backgroundColor: color,
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
                {item.report_month}
              </Typography>
              <Typography color="#555555" sx={{ mt: 0.5 }}>
                {prefix}{formatValue(parseFloat(item[valueKey]))}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <Typography variant="h6" sx={{ mt: 5 }}>
        {title}
      </Typography>
    </Box>
  );
}; 