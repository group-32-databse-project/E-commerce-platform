import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Use named import

const CustomerDeatailForm = () => {
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    gender: 'Male',
  });
  const token = localStorage.getItem('token');
  let id = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use named import
      id = decodedToken.customerId; // Assuming the token contains an 'id' field
     console.log('Decoded id:', id);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    // Fetch data from backend
    fetch(`/api/customers/${id}`)
      .then(response => response.json())
      .then(data => {
        setCustomerData(data);
        console.log('customer Profile data:', customerData);
       
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('name:',name);
    console.log('value:',value);
    setCustomerData(prevState => ({
      ...prevState,
      
      [name]: value,
    }));
    customerData.name = value;
    console.log('phone hi:',customerData.phone_number);
  };

  const handleSave = () => {
    // Send data to backend
    console.log('all:',customerData);
    console.log('phone:',customerData.phone_number);
    fetch(`/api/customers/${id}/update`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ customerData}), // Use JSON.stringify to convert the object to a JSON string
    })
      .then(response => response.json())
      .then(data => {
      console.log('Profile updated successfully:', data);
      })
      .catch(error => {
      console.error('Error updating profile:', error);
      });
  };

  return (
    <Content>
      <Title>Personal Information</Title>
      <Form>
        <FormRow>
          <Label>First Name</Label>
          <Input
            type="text"
            name="first_name"
            value={customerData.first_name}
            onChange={handleInputChange}
          />
          <Label>Last Name</Label>
          <Input
            type="text"
            name="last_name"
            value={customerData.last_name}
            onChange={handleInputChange}
          />
        </FormRow>
        <FormRow>
          <Label>Email</Label>
          <Input
            type="email"
            name="email_address"
            value={customerData.email_address}
            onChange={handleInputChange}
           
          />
        </FormRow>
        <FormRow>
          <Label>Phone</Label>
          <Input
            type="text"
            name="phone_number"
            value={customerData.phone_number}
            onChange={handleInputChange}
          />
        </FormRow>
       
        <FormRow>
          <Label>Gender</Label>
          <GenderOptions>
            <GenderOption
              selected={customerData.gender === 'Male'}
              onClick={() => setCustomerData(prevState => ({ ...prevState, gender: 'Male' }))}
            >
              Male
            </GenderOption>
            <GenderOption
              selected={customerData.gender === 'Female'}
              onClick={() => setCustomerData(prevState => ({ ...prevState, gender: 'Female' }))}
            >
              Female
            </GenderOption>
          </GenderOptions>
        </FormRow>
        <ButtonRow>
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <CancelButton>Cancel</CancelButton>
        </ButtonRow>
      </Form>
    </Content>
  );
};

// Styled Components
const Content = styled.div`
  flex: 1;
  padding: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.div`
  background-color: #ffffff;
  padding: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Label = styled.label`
  flex: 1;
  font-size: 16px;
  color: #666;
`;

const Input = styled.input`
  flex: 2;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const GenderOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const GenderOption = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${props => (props.selected ? '#0056d2' : '#f0f0f0')};
  color: ${props => (props.selected ? '#fff' : '#666')};
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #0056d2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default CustomerDeatailForm;