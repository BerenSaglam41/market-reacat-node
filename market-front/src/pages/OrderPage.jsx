import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import requests from '../api/ApiClient';
import OrderCard from '../compoments/OrderCard';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.account);

  useEffect(() => {
    // Kullanıcı değişikliğinde orders'ı temizle
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await requests.orders.getOrders();
  
        if (Array.isArray(response)) {
          setOrders(response); 
          // Orders'ı localStorage'a kaydet (logout'ta temizlenecek)
          localStorage.setItem('orders', JSON.stringify(response));
        } else if (Array.isArray(response.orders)) {
          setOrders(response.orders);
          localStorage.setItem('orders', JSON.stringify(response.orders));
        } else {
          setOrders([]); 
          localStorage.removeItem('orders');
        }
  
      } catch (err) {
        console.error('Orders fetch error:', err);
        setError("Siparişler yüklenemedi.");
        setOrders([]);
        localStorage.removeItem('orders');
      } finally {
        setLoading(false);
      }
    }
  
    fetchOrders();
  }, [user]); // user değişikliğinde yeniden çalıştır

  // Logout durumunda component'i temizle
  useEffect(() => {
    return () => {
      if (!user) {
        setOrders([]);
        setError(null);
        localStorage.removeItem('orders');
        console.log('📋 OrderPage: Cleaned up on logout');
      }
    };
  }, [user]);
  

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
          onDelete={(id) => {
            const updatedOrders = orders.filter((o) => o._id !== id);
            setOrders(updatedOrders);
            // localStorage'ı da güncelle
            if (updatedOrders.length > 0) {
              localStorage.setItem('orders', JSON.stringify(updatedOrders));
            } else {
              localStorage.removeItem('orders');
            }
          }}
        />
      ))}
    </Box>
  );
};

export default OrderPage;
