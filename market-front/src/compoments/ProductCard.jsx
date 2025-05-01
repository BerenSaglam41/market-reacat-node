import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="180"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {product.price} TL
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Sepete Ekle
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
