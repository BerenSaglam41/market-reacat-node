import React, { useEffect } from 'react';
import ImageSlider from '../compoments/ImageSlider'
import PopularProducts from '../compoments/PopularProducts';
import LocationComponent from '../compoments/LocationComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './cart/cartSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);
  
  useEffect(() => {
    // Sadece login olmuş kullanıcılar için cart'ı yükle
    if (user) {
      console.log('🏠 HomePage: Loading cart for logged user');
      dispatch(fetchCart());
    } else {
      console.log('🏠 HomePage: Guest user, skipping cart load');
    }
  }, [user, dispatch]);
   
  return (
    <>
      <ImageSlider />
      <PopularProducts/>
      <LocationComponent/>
    </>
  );
};

export default HomePage;
