import * as React from 'react';
import { useState, useEffect } from 'react'; // Correct import
import Slider from 'react-slick';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import {jwtDecode} from 'jwt-decode'; // Use named import
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const AddressForm = () => {
  const [customerData, setCustomerData] = useState({ addresses: [] });
  const token = localStorage.getItem('token');
  let id = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use named import
      id = decodedToken.customerId; // Assuming the token contains an 'id' field
      console.log('Decoded token:', id);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    if (id) {
      // Fetch data from backend
      fetch(`/api/customers/${id}/addresses`)
        .then(response => response.json())
        .then(data => {
          setCustomerData(data);
          console.log('Profile data:', data);
        })
        .catch(error => {
          console.error('Error fetching profile data:', error);
        });
    }
  }, [id]);

  const handleInputChange = (e, addressId) => {
    const { name, value } = e.target;
    setCustomerData(prevState => ({
      ...prevState,
      addresses: prevState.addresses.map(address =>
        address.address_id === addressId ? { ...address, [name]: value } : address
      ),
    }));
  };

  const handleSave = (addressId) => {
    const address = customerData.addresses.find(addr => addr.address_id === addressId);
    fetch(`/api/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Address updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating address:', error);
      });
  };

  if (!customerData || !customerData.addresses) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };

  return (
    <Slider {...settings}>
      {customerData.addresses.map((address) => (
        <div key={address.address_id}>
          <Card elevation={3} sx={{ padding: 2, margin: '0 auto', maxWidth: 600 }}>
            <CardContent>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor={`first-name-${address.address_id}`} required>
                  First name
                </FormLabel>
                <OutlinedInput
                  id={`first-name-${address.address_id}`}
                  name="first_name"
                  type="name"
                  placeholder="John"
                  autoComplete="first name"
                  required
                  size="small"
                  value={customerData.first_name}
                  readOnly
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor={`last-name-${address.address_id}`} required>
                  Last name
                </FormLabel>
                <OutlinedInput
                  id={`last-name-${address.address_id}`}
                  name="last_name"
                  type="last-name"
                  placeholder="Snow"
                  autoComplete="last name"
                  required
                  size="small"
                  value={customerData.last_name}
                  readOnly
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={12}>
                <FormLabel htmlFor={`address1-${address.address_id}`} required>
                  Address line 1
                </FormLabel>
                <OutlinedInput
                  id={`address1-${address.address_id}`}
                  name="address_line1"
                  type="address1"
                  placeholder="Street name and number"
                  autoComplete="shipping address-line1"
                  required
                  size="small"
                  value={address.address_line1}
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={12}>
                <FormLabel htmlFor={`address2-${address.address_id}`}>Address line 2</FormLabel>
                <OutlinedInput
                  id={`address2-${address.address_id}`}
                  name="address_line2"
                  type="address2"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  autoComplete="shipping address-line2"
                  size="small"
                  value={address.address_line2 || ''}
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor={`city-${address.address_id}`} required>
                  City
                </FormLabel>
                <OutlinedInput
                  id={`city-${address.address_id}`}
                  name="city"
                  type="city"
                  placeholder="New York"
                  autoComplete="City"
                  required
                  size="small"
                  value={address.city}
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor={`state-${address.address_id}`} required>
                  State
                </FormLabel>
                <OutlinedInput
                  id={`state-${address.address_id}`}
                  name="region"
                  type="state"
                  placeholder="NY"
                  autoComplete="State"
                  required
                  size="small"
                  value={address.region}
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor={`zip-${address.address_id}`} required>
                  Zip / Postal code
                </FormLabel>
                <OutlinedInput
                  id={`zip-${address.address_id}`}
                  name="postal_code"
                  type="zip"
                  placeholder="12345"
                  autoComplete="shipping postal-code"
                  required
                  size="small"
                  value={address.postal_code}
                  onChange={(e) => handleInputChange(e, address.address_id)}
                />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormLabel htmlFor={`country-${address.address_id}`} required>
                  Country
                </FormLabel>
                <OutlinedInput
                  id={`country-${address.address_id}`}
                  name="country"
                  type="country"
                  placeholder="United States"
                  autoComplete="shipping country"
                  required
                  size="small"
                  value="United States" // Assuming country is always United States
                  
                />
              </FormGrid>
              <FormGrid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="saveAddress" value="yes" />}
                  label="Use this address for payment details"
                  disabled
                />
              </FormGrid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(address.address_id)}
                sx={{ mt: 2, width: '100px' }}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  );
}

export default AddressForm;