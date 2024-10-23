import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function Info() {
  // Static sample data
  const totalPrice = "$125.98";
  const products = [
    { id: 1, name: "Product 1", quantity: 2, price: 29.99 },
    { id: 2, name: "Product 2", quantity: 1, price: 66.0 },
  ];

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice}
      </Typography>
      <List disablePadding>
        {products.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.name}
              secondary={`Quantity: ${item.quantity}`}
            />
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

export default Info;
