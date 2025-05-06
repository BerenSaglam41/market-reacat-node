import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
} from '@mui/material';
import { currenyTRY } from '../utils/formats';
import requests from '../api/ApiClient';
import { toast } from 'react-toastify';

const OrderCard = ({ order,onDelete }) => {
  async function handleClick (id) {
    try
    {
    await requests.orders.removeOrder(id);
    toast.success("Sipariş Başarıyla İptal Edildi !")
    onDelete(id)
    }
    catch(err)
    {
      console.log(err);
    }
  }
  return (
    <Paper key={order._id} sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Sipariş Numarası: <strong>{order._id}</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Tarih: {new Date(order.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Durum: <strong>{order.status}</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        Adres: {order.address.address}, {order.address.district}, {order.address.city}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Telefon: {order.address.phone}
      </Typography>

      <List dense>
        {order.items.map((item) => (
          <React.Fragment key={item.productId}>
            <ListItem>
              <ListItemText
                primary={`${item.name} x${item.quantity}`}
                secondary={`Birim Fiyat: ${currenyTRY.format(item.price)}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
        <Box sx={{display:"flex", justifyContent:"space-between"}}>
            <Box>
                <Typography sx={{ mt: 2 }} variant="subtitle1">
                Toplam Tutar: <strong>{currenyTRY.format(order.totalPrice)}</strong>
                </Typography>
            </Box>
            <Box>
              <Button sx={{ mt: 2, color: "red" }} onClick={() => handleClick(order._id)}>
                Siparişi İptal Et
              </Button>
            </Box>
        </Box>

    </Paper>
  );
};

export default OrderCard;
