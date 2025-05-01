// src/components/ProductCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button
} from '@mui/material';

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={`http://localhost:5000/uploads/${product.image}`} // resim yolu
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
        <Button size="small" variant="outlined">Sepete Ekle</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
