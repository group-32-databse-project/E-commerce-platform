import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText 
} from '@mui/material';

const Dropdown = ({ 
  options, 
  value, 
  onChange, 
  label = "Select", 
  placeholder = "Select an option",
  error = false,
  helperText = "",
  required = false,
  disabled = false,
  fullWidth = true,
  sx = {}
}) => {
  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error}
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1f2a40',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
          },
          ...sx
        }}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            sx={{
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Dropdown; 