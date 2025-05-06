import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectTopSoldProducts
} from '../productSlice/productSlice';
import {
  Grid,
  Typography,
  Paper
} from '@mui/material';
import ProductCard from './ProductCard';
import Loading from './Loading';

const PopularProducts = () => {
  const dispatch = useDispatch();
  const popularProducts = useSelector((state) => selectTopSoldProducts(state, 4));
  const { status, isLoaded } = useSelector((state) => state.product);

  useEffect(() => {
    if (!isLoaded) dispatch(fetchProducts());
  }, [isLoaded, dispatch]);

  if (status === 'pendingFetchProducts') return <Loading />;

  return (
    <Paper elevation={3} sx={{ mt: 5, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        En Çok Sepete Eklenen Ürünler
      </Typography>
      <Grid container sx={{ml:20}} spacing={3}>
        {popularProducts.map((product) => (
          <Grid columnSpan={{ xs: 12, sm: 6 }} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PopularProducts;
