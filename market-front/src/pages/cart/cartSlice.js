import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requests from "../../api/ApiClient";
import { toast } from "react-toastify";

// Başlangıç durumu
const initialState = {
  cart: null,
  status: "idle",
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetch", async (_, thunkAPI) => {
  try {
    const response = await requests.cart.get(); // API'den sepeti al
    thunkAPI.dispatch(setCart(response.items)); // Redux state'ine kaydet    
    localStorage.setItem("cart", JSON.stringify(response.items)); // localStorage'a da yaz
    return response.items;
  } catch (error) {
    // Sessiz fail - 401/403 hatalarını log'da tut ama toast gösterme
    console.log('📞 Cart fetch error (normal for guests):', error.response?.status);
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addToCart = createAsyncThunk("cart/add", async (productId, thunkAPI) => {
  try {
    const response = await requests.cart.addItem(productId);
    toast.success(`Sepete eklendi !`);
    thunkAPI.dispatch(setCart(response.items));
    localStorage.setItem("cart", JSON.stringify(response.items));
    return response.items;
  } catch (error) {
    toast.error("Ürün eklenemedi");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async ({ productId, quantity }, thunkAPI) => {
  try {
    const response = await requests.cart.removeItem(productId, quantity);
    toast.success(`Ürün silme başarılı`);
    thunkAPI.dispatch(setCart(response.items));
    localStorage.setItem("cart", JSON.stringify(response.items));
    return response.items;
  } catch (error) {
    toast.error("Ürün çıkarılamadı");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Redux içinde cart'ı doğrudan setle
    setCart: (state, action) => {
      state.cart = action.payload;
      localStorage.setItem("cart", JSON.stringify(action.payload)); // localStorage'a da yaz
    },
    // Sepeti temizle
    clearCart: (state) => {
      state.cart = null;
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Logout durumunda cart'ı temizle
      .addCase('account/logoutThunk/fulfilled', (state) => {
        console.log('📋 Cart cleared on logout');
        state.cart = null;
        state.status = "idle";
        state.error = null;
        localStorage.removeItem("cart");
      });
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer