import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from '../pages/account/accountSlice';
import { productSlice } from '../productSlice/productSlice';

export const store = configureStore({
    reducer : {
        account : accountSlice.reducer,
        product : productSlice.reducer
    }
});