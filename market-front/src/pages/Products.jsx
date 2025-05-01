import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../productSlice/productSlice';
import Loading from '../compoments/Loading';
import { Grid } from '@mui/material';
import ProductCard from '../compoments/ProductCard';


const Products = () => {
  const dispatch = useDispatch()
  const loadedProducts = useSelector(selectAllProducts);
  const { status,isLoaded } = useSelector((state)=>state.product);
  useEffect(()=>{
    if(!isLoaded) dispatch(fetchProducts())
  },[isLoaded])
  if(status === "pendingFetchProducts") return <Loading/>
  
  return (
    <>
    <Grid container spacing={3} justifyContent='center'>
      {
        loadedProducts.map((product,index)=>(
          <Grid key={product._id || index}>
            <ProductCard product={product}/>
          </Grid>
        ))
      }
    </Grid>
    </>
  )
}

export default Products
