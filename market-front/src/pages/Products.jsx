import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../productSlice/productSlice';
import Loading from '../compoments/Loading';
import { Grid, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import ProductCard from '../compoments/ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadedProducts = useSelector(selectAllProducts);
  const { status } = useSelector((state) => state.product);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const [category, setCategory] = useState(queryParams.category || '');
  const [minPrice, setMinPrice] = useState(queryParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.maxPrice || '');
  const [name, setName] = useState(queryParams.name || '');

  useEffect(() => {
    dispatch(fetchProducts(queryParams));
  }, [location.search]);

  const handleFilter = () => {
    const params = {};
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (name) params.name = name;

    const search = queryString.stringify(params);
    navigate(`/products?${search}`);
  };

  if (status === "pendingFetchProducts") return <Loading />;

  return (
    <Box sx={{ px: 3}}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Kategori</InputLabel>
          <Select value={category} label="Kategori" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="food">Yiyecek</MenuItem>
            <MenuItem value="drink">İçecek</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Min Fiyat"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <TextField
          label="Max Fiyat"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <TextField
          label="Ürün Adı"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filtrele
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent='center'>
        {
          loadedProducts.map((product, index) => (
            <Grid key={product._id || index}>
              <ProductCard product={product} />
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
};

export default Products;
