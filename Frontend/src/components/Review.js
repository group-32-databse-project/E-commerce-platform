import * as React from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import getAddress from "../api/getAddress";

const addresses = ["1 MUI Drive", "Reactville", "Anytown", "99999", "USA"];
const payments = [
  { name: "Card type:", detail: "Visa" },
  { name: "Card holder:", detail: "Mr. John Smith" },
  { name: "Card number:", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date:", detail: "04/2024" },
];

export default function Review() {
  const [address, setAddress] = useState(null);
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
        {address && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Shipment details
            </Typography>
            <Typography gutterBottom>John Smith</Typography>
            <Typography gutterBottom sx={{ color: "text.secondary" }}>
              {address.address_line1}, {address.address_line2}, {address.city},
              {address.postal_code}
            </Typography>
            <Typography gutterBottom sx={{ color: "text.secondary" }}>
              {address.is_main_city ? "Main City" : "Rural Area"}
            </Typography>
          </div>
        )}
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
