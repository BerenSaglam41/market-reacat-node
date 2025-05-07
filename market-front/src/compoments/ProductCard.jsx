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
  Backdrop
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../pages/cart/cartSlice';
import ProductDetails from '../pages/ProductDetails';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleAddToCart = (productId) => {
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
          image={`http://localhost:5000/uploads/${product.image}`}
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
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleAddToCart(product._id)}
          >
            Sepete Ekle
          </Button>
        </CardActions>
      </Card> 
      <ProductDetails open={open} setOpen={setOpen} product={product}/>      
    </>
  );
};

export default ProductCard;
