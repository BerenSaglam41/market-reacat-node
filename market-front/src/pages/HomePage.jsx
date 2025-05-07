import React, { useEffect } from 'react';
import ImageSlider from '../compoments/ImageSlider'
import PopularProducts from '../compoments/PopularProducts';
import LocationComponent from '../compoments/LocationComponent';
import { useDispatch } from 'react-redux';
import { fetchCart } from './cart/cartSlice';


const HomePage = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchCart());
  },[])   
  return (
    <>
      <ImageSlider />
      <PopularProducts/>
      <LocationComponent/>
    </>
  );
};

export default HomePage;
