import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../productSlice/productSlice';
import Loading from '../compoments/Loading';


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
      {
        loadedProducts.map((product)=>{
          return <p key={product._id}>{product.name}</p>
        })
      }
      sa
    </>
  )
}

export default Products
