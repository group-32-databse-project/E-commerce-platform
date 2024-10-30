import * as React from 'react';

import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import getAddress from "../api/getAddress";
import getCustomerDetail from "../api/custermerDetail";
import getPayment from "../api/getPayment";

export default function Review() {
  const [customer, setCustomer] = useState(null);
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const customer = await getCustomerDetail();
      setCustomer(customer);
    };
    fetchCustomer();
  }, []);

  useEffect(() => {
    const fetchPayment = async () => {
      const payment = await getPayment();
      setPayment(payment);
    };
    fetchPayment();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddress();
      setAddress(address);
    };
    fetchAddress();
  }, []);

  return (
    <Stack spacing={2}>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        {customer && address && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Shipment details
            </Typography>
            <Divider />
            <Typography gutterBottom>
              {customer.first_name} {customer.last_name}
            </Typography>
            <Typography gutterBottom sx={{ color: "text.secondary" }}>
              {address.address_line1}, {address.address_line2}, {address.city},
              {address.postal_code}
            </Typography>
            <Typography gutterBottom sx={{ color: "text.secondary" }}>
              {address.is_main_city ? "Main City" : "Rural Area"}
            </Typography>
          </div>
        )}
        {payment && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Payment details
            </Typography>
            <Grid container>
              <React.Fragment key={payment.card_type}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Card type:
                  </Typography>
                  <Typography variant="body2">{payment.card_type}</Typography>
                </Stack>
              </React.Fragment>

              <React.Fragment key={payment.card_holder}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Card holder:
                  </Typography>
                  <Typography variant="body2">{payment.card_owner}</Typography>
                </Stack>
              </React.Fragment>

              <React.Fragment key={payment.card_number}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Card number:
                  </Typography>
                  <Typography variant="body2">
                    **** **** **** {payment.last_four_digits}
                  </Typography>
                </Stack>
              </React.Fragment>

              <React.Fragment key={payment.expiration_date}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Expiry date:
                  </Typography>
                  <Typography variant="body2">
                    {payment.expiration_date}
                  </Typography>
                </Stack>
              </React.Fragment>
            </Grid>
          </div>
        )}
      </Stack>
    </Stack>
  );
}
