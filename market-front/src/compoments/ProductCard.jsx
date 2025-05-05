import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';  
import { addToCart } from '../pages/cart/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  
  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId)) 
  };


  return (
    <Card sx={{ maxWidth: 300, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={`http://localhost:5000/uploads/${product.image}`} 
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description || "Açıklama yok."}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {product.price} ₺
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Detay</Button>
        <Button 
          size="small" 
          variant="outlined"
          onClick={() => handleAddToCart(product._id)} 
        >
         Sepete Ekle
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
