import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import requests from '../api/ApiClient';
import OrderCard from '../compoments/OrderCard';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await requests.orders.getOrders();
  
        if (Array.isArray(response)) {
          setOrders(response); 
        } else if (Array.isArray(response.orders)) {
          setOrders(response.orders);
        } else {
          setOrders([]); 
        }
  
      } catch (err) {
        console.error(err);
        setError("Siparişler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchOrders();
  }, []);
  

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!orders || orders.length === 0) return <Typography>Sipariş geçmişiniz boş.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Siparişlerim
      </Typography>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onDelete={(id) => setOrders((prev) => prev.filter((o) => o._id !== id))}
        />
      ))}
    </Box>
  );
};

export default OrderPage;
