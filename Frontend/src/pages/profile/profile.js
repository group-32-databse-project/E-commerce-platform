import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUserCircle } from 'react-icons/fa';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CustomerDeatailForm from '../../components/customerDeatailform';
import PaymentForm from '../../components/PaymentForm';
import AddressForm from '../../components/AddressForm';
import MyOrders from '../../components/Myorders';
import { jwtDecode } from 'jwt-decode'; // Use named import

const Profile = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    "Personal Information"
  );
  const [customerName, setCustomerName] = useState();

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };
  const token = localStorage.getItem("token");
  let id = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Use named import
      id = decodedToken.customerId; // Assuming the token contains an 'id' field
      console.log("Decoded id:", id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    // Fetch data from backend
    fetch(`/api/customers/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCustomerName(data.first_name + " " + data.last_name);
        console.log("Profile data:", customerName);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [customerName]);

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "My Orders":
        return <MyOrders />;
      case "Personal Information":
        return <CustomerDeatailForm />;
      case "Address":
        return <AddressForm />;
      case "Payment Methods":
        return <PaymentForm />;
      default:
        return <CustomerDeatailForm />;
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Sidebar>
          <ProfileContainer>
            <FaUserCircle size={70} />
            <Name>{customerName}</Name>
          </ProfileContainer>
          <Menu>
            <MenuItem
              selected={selectedMenuItem === "My Orders"}
              onClick={() => handleMenuItemClick("My Orders")}
            >
              My Orders
            </MenuItem>
            <MenuItem
              selected={selectedMenuItem === "Personal Information"}
              onClick={() => handleMenuItemClick("Personal Information")}
            >
              Personal Information
            </MenuItem>
            <MenuItem
              selected={selectedMenuItem === "Address"}
              onClick={() => handleMenuItemClick("Address")}
            >
              Address
            </MenuItem>
            <MenuItem
              selected={selectedMenuItem === "Payment Methods"}
              onClick={() => handleMenuItemClick("Payment Methods")}
            >
              Payment Methods
            </MenuItem>
          </Menu>
        </Sidebar>
        <Content>{renderContent()}</Content>
      </Container>
      <Footer />
    </>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f8f8f8;
  padding: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Name = styled.h2`
  margin: 10px 0 5px;
`;


const Menu = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 10px 0;
  cursor: pointer;
  color: ${props => (props.selected ? '#000' : '#888')};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  background-color: ${props => (props.selected ? '#e0e0e0' : 'transparent')};
  border-radius: 4px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export default Profile;