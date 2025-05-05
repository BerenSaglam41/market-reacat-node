import { configureStore, } from '@reduxjs/toolkit'
import { accountSlice } from '../pages/account/accountSlice';
import { productSlice } from '../productSlice/productSlice';
import cartReducer from '../pages/cart/cartSlice.js'; 

export const store = configureStore({
    reducer : {
        account : accountSlice.reducer,
        product : productSlice.reducer,
        cart : cartReducer
    }
});