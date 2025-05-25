import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Backdrop,
  Tooltip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../pages/cart/cartSlice';
import ProductDetails from '../pages/ProductDetails';
import { useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);
  const [open, setOpen] = useState(false);

  const handleAddToCart = (productId) => {
    if (!user) {
      // Kullanıcı giriş yapmamışsa login'e yönlendir
      navigate('/login');
      return;
    }
    dispatch(addToCart(productId));
  };

  const handleOpenDetails = () => {
    setOpen(true);
  };


  return (
    <>
      <Card sx={{ width: 250, m: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardMedia
          component="img"
          image={product.image ? `${import.meta.env.VITE_API_BASE_URL || 'https://market-reacat-node-production.up.railway.app'}/uploads/${product.image}` : '/placeholder.png'}
          alt={product.name}
          sx={{
            height: 180,
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            p: 1
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.description || "Açıklama yok."}
          </Typography>
          <Typography variant="subtitle2" color="primary">
            {product.price} ₺
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button size="small" onClick={handleOpenDetails}>Detay</Button>
          {user ? (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAddToCart(product._id)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </Button>
          ) : (
            <Tooltip title="Sepete eklemek için giriş yapın">
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleAddToCart(product._id)}
              >
                Giriş Yap
              </Button>
            </Tooltip>
          )}
        </CardActions>
      </Card> 
      <ProductDetails open={open} setOpen={setOpen} product={product}/>      
    </>
  );
};

export default ProductCard;
